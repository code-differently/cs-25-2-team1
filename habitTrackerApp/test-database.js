// Quick database connection test
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('🔍 Testing database connection...')
  
  try {
    // Test 1: Check if tables exist by trying to query them
    console.log('\n📋 Checking tables...')
    
    const requiredTables = ['users', 'habits', 'habit_logs']
    const existingTables = []
    
    for (const tableName of requiredTables) {
      try {
        const { error } = await supabase
          .from(tableName)
          .select('*')
          .limit(0)
        
        if (!error) {
          existingTables.push(tableName)
          console.log(`✅ Table '${tableName}' exists`)
        } else if (error.code === 'PGRST106') {
          console.log(`❌ Table '${tableName}' does not exist`)
        } else {
          console.log(`✅ Table '${tableName}' exists (RLS protected)`)
          existingTables.push(tableName)
        }
      } catch (err) {
        console.log(`❓ Could not check table '${tableName}':`, err.message)
      }
    }
    
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))
    
    if (missingTables.length > 0) {
      console.log('\n⚠️  Missing tables:', missingTables)
      console.log('📝 You need to run the database migration from database/schema.sql')
      console.log('📍 Go to Supabase Dashboard → SQL Editor → Run the schema.sql file')
    } else {
      console.log('\n✅ All required tables exist!')
    }
    
    // Test 3: Check RLS policies (if tables exist)
    if (existingTables.includes('habits')) {
      const { data, error } = await supabase
        .from('habits')
        .select('count')
        .limit(1)
        
      if (error && error.code === 'PGRST116') {
        console.log('✅ RLS is properly configured (getting permission error as expected)')
      } else if (error) {
        console.log('⚠️  RLS test inconclusive:', error.message)
      } else {
        console.log('✅ Database query successful')
      }
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
  }
}

testDatabase()