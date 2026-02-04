import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseClient } from '../../lib/supabase-server.js';
import { verifySessionToken } from '../auth/verify-otp.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionToken, questionnaireId } = req.body;

    if (!sessionToken) {
      return res.status(401).json({ error: 'Session token required' });
    }

    const session = await verifySessionToken(sessionToken);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    if (!questionnaireId) {
      return res.status(400).json({ error: 'Questionnaire ID required' });
    }

    let supabase;
    try {
      supabase = getSupabaseClient();
    } catch (supabaseError: any) {
      console.error('Supabase configuration error:', supabaseError);
      return res.status(500).json({ error: 'Server configuration error. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.' });
    }

    // Delete questionnaire (only if it belongs to this contact)
    const { data, error } = await supabase
      .from('questionnaires')
      .delete()
      .eq('contact_identifier', session.contact)
      .eq('questionnaire_id', questionnaireId)
      .select();

    if (error) {
      console.error('Error deleting questionnaire:', error);
      return res.status(500).json({ error: 'Failed to delete questionnaire' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error deleting questionnaire:', error);
    
    // Handle Supabase configuration errors
    if (error?.message?.includes('Supabase URL and Service Role Key')) {
      return res.status(500).json({ error: 'Server configuration error. Please check environment variables.' });
    }
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}
