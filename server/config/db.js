const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;

const ws = require('ws');

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      realtime: { transport: ws },
    });
    console.log('✅ Supabase PostgreSQL Client Initialized Successfully');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('ℹ️ Supabase environment variables missing or default. Operating with fallback storage/mock layer.');
}

module.exports = { supabase };
