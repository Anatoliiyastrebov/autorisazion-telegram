import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { getSupabaseClient } from '../../lib/supabase-server.js';
import { verifySessionToken } from '../auth/verify-otp.js';

function encrypt(text: string, encryptionKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}


export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check encryption key inside handler to return proper JSON error
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  if (!ENCRYPTION_KEY) {
    console.error('ENCRYPTION_KEY environment variable is required');
    return res.status(500).json({ error: 'Server configuration error. ENCRYPTION_KEY is not set.' });
  }

  try {
    const { sessionToken, questionnaire } = req.body;

    if (!questionnaire || !questionnaire.id) {
      return res.status(400).json({ error: 'Questionnaire data required' });
    }

    // Determine contact_identifier and contact_type
    // Priority: sessionToken > questionnaire.contactData
    let contactIdentifier: string;
    let contactType: string;

    if (sessionToken) {
      // User is authenticated - use session data
      const session = await verifySessionToken(sessionToken);
      if (!session) {
        return res.status(401).json({ error: 'Invalid or expired session' });
      }
      contactIdentifier = session.contact;
      contactType = session.contactType;
    } else {
      // User not authenticated - use contactData from questionnaire
      // This allows saving questionnaires even without authentication
      // User will need to authenticate later to view them
      if (!questionnaire.contactData) {
        return res.status(400).json({ error: 'Contact data required when not authenticated' });
      }

      const { telegram, phone } = questionnaire.contactData;
      
      if (telegram && telegram.trim()) {
        contactIdentifier = telegram.trim().replace(/^@/, '').toLowerCase();
        contactType = 'telegram';
      } else if (phone && phone.trim()) {
        contactIdentifier = phone.trim().replace(/[\s\-\(\)]/g, '');
        contactType = 'phone';
      } else {
        return res.status(400).json({ error: 'Telegram or phone is required in contact data' });
      }
    }

    // Encrypt sensitive data before storing
    const encryptedData = encrypt(JSON.stringify(questionnaire), ENCRYPTION_KEY);
    
    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (supabaseError: any) {
      console.error('Supabase configuration error:', supabaseError);
      return res.status(500).json({ error: 'Server configuration error. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    }

    // Check if questionnaire already exists
    const { data: existing } = await supabase
      .from('questionnaires')
      .select('id')
      .eq('contact_identifier', contactIdentifier)
      .eq('questionnaire_id', questionnaire.id)
      .single();

    if (existing) {
      // Update existing questionnaire
      const { error: updateError } = await supabase
        .from('questionnaires')
        .update({
          encrypted_data: encryptedData,
          questionnaire_type: questionnaire.type,
          language: questionnaire.language,
          submitted_at: questionnaire.submittedAt || Date.now(),
          telegram_message_id: questionnaire.telegramMessageId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating questionnaire:', updateError);
        return res.status(500).json({ error: 'Failed to update questionnaire' });
      }
    } else {
      // Insert new questionnaire
      const { error: insertError } = await supabase
        .from('questionnaires')
        .insert({
          questionnaire_id: questionnaire.id,
          contact_identifier: contactIdentifier,
          contact_type: contactType,
          encrypted_data: encryptedData,
          questionnaire_type: questionnaire.type,
          language: questionnaire.language,
          submitted_at: questionnaire.submittedAt || Date.now(),
          telegram_message_id: questionnaire.telegramMessageId || null,
        });

      if (insertError) {
        console.error('Error saving questionnaire:', insertError);
        return res.status(500).json({ error: 'Failed to save questionnaire' });
      }
    }

    return res.status(200).json({
      success: true,
      id: questionnaire.id,
    });
  } catch (error: any) {
    console.error('Error saving questionnaire:', error);
    
    // Handle Supabase configuration errors
    if (error?.message?.includes('Supabase URL and Service Role Key')) {
      return res.status(500).json({ error: 'Server configuration error. Please check environment variables.' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
