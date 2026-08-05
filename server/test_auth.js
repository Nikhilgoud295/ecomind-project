const bcrypt = require('bcryptjs');
const { supabase } = require('./config/db');

async function testLogin() {
  const email = 'demo@ecomind.ai';
  const password = 'demopassword123';

  console.log('Testing login for:', email);

  if (!supabase) {
    console.error('❌ Supabase client is NULL! Check server/.env credentials.');
    return;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !data) {
    console.error('❌ Supabase query error or user not found:', error);
    return;
  }

  console.log('Found user in Supabase:', data.email, 'ID:', data.id);
  console.log('Hash in DB:', data.password_hash);

  const isMatch = await bcrypt.compare(password, data.password_hash);
  console.log('bcrypt match result:', isMatch);

  if (isMatch) {
    console.log('✅ LOGIN SUCCESSFUL!');
  } else {
    console.error('❌ Password hash mismatch!');
  }
}

testLogin();
