// Test Supabase connection
import { supabase } from '../lib/supabase'

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('Anon Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
    
    // Test a simple query
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('Connection error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, data }
  } catch (error) {
    console.error('Connection failed:', error)
    return { success: false, error: error.message }
  }
}

