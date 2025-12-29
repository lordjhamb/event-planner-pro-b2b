
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing env vars!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    // 1. Get latest wedding
    const { data: weddings, error: wError } = await supabase
        .from('weddings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (wError) {
        console.error("Error fetching wedding:", wError);
        return;
    }

    if (!weddings || weddings.length === 0) {
        console.log("No weddings found.");
        return;
    }

    const latest = weddings[0];
    console.log("Latest Wedding:", latest.name, "(ID:", latest.id, ")");

    // 2. Check for events
    const { data: events, error: eError } = await supabase
        .from('events')
        .select('*')
        .eq('weddingId', latest.id);

    if (eError) {
        console.error("Error fetching events:", eError);
    } else {
        console.log(`Found ${events.length} events for this wedding:`);
        events.forEach(e => console.log(` - [${e.id}] ${e.name} (${e.dates})`));
    }
}

check();
