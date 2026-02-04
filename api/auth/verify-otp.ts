import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getSupabaseClient } from '../../lib/supabase-server.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { telegram, phone, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    if (!telegram && !phone) {
      return res.status(400).json({ error: 'Telegram or phone is required' });
    }

    const contactIdentifier = telegram 
      ? telegram.trim().replace(/^@/, '').toLowerCase() 
      : phone?.trim().replace(/[\s\-\(\)]/g, '') || '';
    const contactType = telegram ? 'telegram' : 'phone';

    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (supabaseError: any) {
      console.error('Supabase configuration error:', supabaseError);
      return res.status(500).json({ error: 'Server configuration error. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    }

    // Clean expired OTPs first
    await supabase.rpc('clean_expired_otp');

    // Find OTP in database
    const { data: otpData, error: otpError } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('contact_identifier', contactIdentifier)
      .eq('code', otp)
      .single();

    if (otpError || !otpData) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired
    if (new Date(otpData.expires_at) < new Date()) {
      await supabase
        .from('otp_codes')
        .delete()
        .eq('id', otpData.id);
      return res.status(400).json({ error: 'OTP expired' });
    }

    // OTP is valid, create session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Clean expired sessions
    await supabase.rpc('clean_expired_sessions');

    // Store session in database
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        session_token: sessionToken,
        contact_identifier: contactIdentifier,
        contact_type: contactType,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      // Log error server-side only
      console.error('Error creating session:', sessionError);
      return res.status(500).json({ error: 'Failed to create session' });
    }

    // Remove used OTP
    await supabase
      .from('otp_codes')
      .delete()
      .eq('id', otpData.id);

    return res.status(200).json({
      success: true,
      sessionToken,
      expiresAt: expiresAt.getTime(),
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    
    // Handle Supabase configuration errors
    if (error?.message?.includes('Supabase URL and Service Role Key')) {
      return res.status(500).json({ error: 'Server configuration error. Please check environment variables.' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to verify session token (for use in other API routes)
export async function verifySessionToken(token: string): Promise<{ contact: string; contactType: string } | null> {
  try {
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (supabaseError: any) {
      console.error('Supabase configuration error in verifySessionToken:', supabaseError);
      return null; // Return null instead of throwing to allow graceful error handling
    }
    
    // Clean expired sessions first
    await supabase.rpc('clean_expired_sessions');

    const { data: session, error } = await supabase
      .from('sessions')
      .select('contact_identifier, contact_type, expires_at')
      .eq('session_token', token)
      .single();

    if (error || !session) {
      return null;
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase
        .from('sessions')
        .delete()
        .eq('session_token', token);
      return null;
    }

    // Update last_used_at
    await supabase
      .from('sessions')
      .update({ last_used_at: new Date().toISOString() })
      .eq('session_token', token);

    return {
      contact: session.contact_identifier,
      contactType: session.contact_type,
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return null;
  }
}
