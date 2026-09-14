import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://jvfwjgkzgfnuegcclgrf.supabase.co';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_S6vRxatye1oIsIf0k1oSHQ_7m08GtvP';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
    },
    server: {
      port: 5174,
      open: false,
      host: true
    },
    build: {
      outDir: 'dist',
      sourcemap: true
    }
  };
})
