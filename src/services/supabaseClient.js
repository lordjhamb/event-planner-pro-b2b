import { createClient } from '@supabase/supabase-js';

// Default Supabase configuration (Publishable keys safe for frontend client)
const DEFAULT_SUPABASE_URL = 'https://jvfwjgkzgfnuegcclgrf.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_S6vRxatye1oIsIf0k1oSHQ_7m08GtvP';

const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.SUPABASE_URL ||
    DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    import.meta.env.SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('YOUR_SUPABASE') &&
    supabaseUrl.startsWith('http')
);

if (!isSupabaseConfigured) {
    console.warn('Supabase is not configured. Please check your Supabase URL and anon key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
