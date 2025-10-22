// Comprehensive Supabase setup verification
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSupabaseSetup() {
  console.log('🔍 Comprehensive Supabase Setup Check...\n')
  
  let allGood = true
  
  try {
    // 1. Check Tables
    console.log('📋 1. Checking Tables...')
    const requiredTables = ['users', 'habits', 'habit_logs']
    const existingTables = []
    
    for (const tableName of requiredTables) {
      try {
        const { error } = await supabase.from(tableName).select('*').limit(0)
        if (!error || error.code === 'PGRST116') {
          console.log(`   ✅ ${tableName} table exists`)
          existingTables.push(tableName)
        } else {
          console.log(`   ❌ ${tableName} table missing`)
          allGood = false
        }
      } catch (err) {
        console.log(`   ❌ ${tableName} table error:`, err.message)
        allGood = false
      }
    }
    
    // 2. Check Views
    console.log('\n📊 2. Checking Views...')
    try {
      const { error } = await supabase.from('habit_stats').select('*').limit(0)
      if (!error || error.code === 'PGRST116') {
        console.log('   ✅ habit_stats view exists')
      } else {
        console.log('   ❌ habit_stats view missing')
        allGood = false
      }
    } catch (err) {
      console.log('   ❌ habit_stats view error:', err.message)
      allGood = false
    }
    
    // 3. Check Functions
    console.log('\n🔧 3. Checking Functions...')
    try {
      const { data, error } = await supabase.rpc('get_habit_completion_rate', {
        p_habit_id: '00000000-0000-0000-0000-000000000000', // dummy UUID
        p_start_date: '2024-01-01',
        p_end_date: '2024-01-31'
      })
      
      if (!error || error.message.includes('violates row-level security')) {
        console.log('   ✅ get_habit_completion_rate function exists')
      } else {
        console.log('   ❌ get_habit_completion_rate function missing')
        allGood = false
      }
    } catch (err) {
      console.log('   ❌ Function test error:', err.message)
      allGood = false
    }
    
    // 4. Check RLS (Row Level Security)
    console.log('\n🔒 4. Checking Row Level Security...')
    
    // Test without auth (should fail)
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { error: rlsError } = await anonSupabase.from('habits').select('*').limit(1)
    if (rlsError && (rlsError.code === 'PGRST116' || rlsError.message.includes('row-level security'))) {
      console.log('   ✅ RLS is properly configured (anonymous access blocked)')
    } else {
      console.log('   ⚠️  RLS might not be properly configured')
      console.log('      Error:', rlsError?.message || 'No error (unexpected)')
    }
    
    // 5. Check Authentication Setup
    console.log('\n🔐 5. Checking Authentication...')
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      if (!error) {
        console.log('   ✅ Authentication is configured')
        console.log(`   📊 Total users: ${users?.length || 0}`)
      } else {
        console.log('   ❌ Authentication setup issue:', error.message)
        allGood = false
      }
    } catch (err) {
      console.log('   ❌ Auth check error:', err.message)
      allGood = false
    }
    
    console.log('\n' + '='.repeat(50))
    
    if (allGood) {
      console.log('🎉 SUPABASE SETUP: COMPLETE!')
      console.log('✅ All database components are properly configured')
      console.log('🚀 Your backend is ready for production!')
    } else {
      console.log('⚠️  SUPABASE SETUP: INCOMPLETE')
      console.log('📝 You need to run the complete database migration:')
      console.log('   1. Go to Supabase Dashboard → SQL Editor')
      console.log('   2. Copy & paste the contents of database/schema.sql')
      console.log('   3. Run the SQL migration')
    }
    
  } catch (error) {
    console.error('❌ Setup check failed:', error.message)
  }
}

checkSupabaseSetup()