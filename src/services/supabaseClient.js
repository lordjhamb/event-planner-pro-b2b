import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
    rawUrl &&
    rawAnonKey &&
    !rawUrl.includes('YOUR_SUPABASE') &&
    rawUrl.startsWith('http')
);

if (!isSupabaseConfigured) {
    console.error('CRITICAL: Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing or invalid! Please add them in your Vercel Project Settings or .env file.');
}

// Fallback to safe placeholders if env vars are missing so module loading doesn't throw a fatal exception
const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isSupabaseConfigured ? rawAnonKey : 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
