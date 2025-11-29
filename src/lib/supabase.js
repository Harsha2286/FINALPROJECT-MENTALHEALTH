import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging (remove in production)
console.log('🔍 Supabase Configuration Check:')
console.log('URL:', supabaseUrl || '❌ MISSING')
console.log('Anon Key:', supabaseAnonKey ? '✅ Present' : '❌ MISSING')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
  console.error('💡 Make sure your .env file exists in the project root with:')
  console.error('   VITE_SUPABASE_URL=your_url')
  console.error('   VITE_SUPABASE_ANON_KEY=your_key')
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test connection on load
supabase.from('profiles').select('count').limit(0).then(({ error }) => {
  if (error) {
    console.error('❌ Supabase connection test failed:', error.message)
    console.error('💡 Check:')
    console.error('   1. Your Supabase project is active')
    console.error('   2. The URL is correct:', supabaseUrl)
    console.error('   3. The anon key is correct')
    console.error('   4. You have run the database schema.sql')
  } else {
    console.log('✅ Supabase connection successful!')
  }
})

