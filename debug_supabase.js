import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser since we might not have dotenv
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) env[key.trim()] = val.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

console.log(`Connecting to: ${supabaseUrl}`);
// Mask key for safety in logs
console.log(`Key: ${supabaseKey ? supabaseKey.substring(0, 5) + '...' : 'MISSING'}`);

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log("Testing 'organizations' table...");
        const { data: orgs, error: orgError } = await supabase.from('organizations').select('count', { count: 'exact', head: true });

        if (orgError) {
            console.error("Organization Check Failed:", orgError);
        } else {
            console.log("Organization Check Success. Count result:", orgs);
        }

        console.log("Testing 'profiles' table...");
        const { data: profiles, error: profError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (profError) {
            console.error("Profiles Check Failed:", profError);
        } else {
            console.log("Profiles Check Success.");
        }

    } catch (err) {
        console.error("Unexpected Error during test:", err);
    }
}

testConnection();
