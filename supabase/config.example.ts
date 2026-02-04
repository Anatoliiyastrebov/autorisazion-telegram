// Example Supabase configuration
// Copy this to your environment variables in Vercel

export const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '', // For server-side operations
  anonKey: process.env.SUPABASE_ANON_KEY || '', // For client-side operations (if needed)
};
