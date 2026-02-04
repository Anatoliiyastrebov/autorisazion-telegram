import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from '../../lib/supabase-server.js';
import { verifySessionToken } from '../auth/verify-otp.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Session token required' });
    }

    const session = await verifySessionToken(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (supabaseError: any) {
      console.error('Supabase configuration error:', supabaseError);
      return res.status(500).json({ error: 'Server configuration error. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    }

    // Check if GDPR request already exists for this profile
    const { data: existingRequest } = await supabase
      .from('gdpr_requests')
      .select('id, status, scheduled_delete_at')
      .eq('profile_id', session.contact)
      .eq('status', 'pending')
      .maybeSingle();

    if (existingRequest) {
      return res.status(200).json({
        success: true,
        message: 'GDPR deletion request already exists',
        requestId: existingRequest.id,
        scheduledDeleteAt: existingRequest.scheduled_delete_at,
        status: existingRequest.status,
      });
    }

    // Create new GDPR request
    // scheduled_delete_at will be automatically calculated as created_at + 3 days
    const { data: newRequest, error: insertError } = await supabase
      .from('gdpr_requests')
      .insert({
        profile_id: session.contact,
        status: 'pending',
      })
      .select('id, created_at, scheduled_delete_at, status')
      .single();

    if (insertError) {
      console.error('Error creating GDPR request:', insertError);
      return res.status(500).json({ error: 'Failed to create GDPR deletion request' });
    }

    return res.status(200).json({
      success: true,
      message: 'GDPR deletion request created successfully. Your data will be deleted in 7 days (1 week). Only questionnaires older than 1 week will be deleted.',
      requestId: newRequest.id,
      createdAt: newRequest.created_at,
      scheduledDeleteAt: newRequest.scheduled_delete_at,
      status: newRequest.status,
    });
  } catch (error: any) {
    console.error('Error creating GDPR request:', error);
    
    // Handle Supabase configuration errors
    if (error?.message?.includes('Supabase URL and Service Role Key')) {
      return res.status(500).json({ error: 'Server configuration error. Please check environment variables.' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
