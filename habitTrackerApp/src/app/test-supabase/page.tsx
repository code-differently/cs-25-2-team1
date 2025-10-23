'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export default function TestSupabase() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClientComponentClient()

  const testConnection = async () => {
    console.log('Test button clicked!')
    setLoading(true)
    setResult('Starting tests...\n')
    
    try {
      // Test 1: Basic connection
      console.log('Testing database connection...')
      setResult(prev => prev + 'Testing database connection...\n')
      
      const { data: testData, error: testError } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      const dbResult = testError ? `FAILED - ${testError.message}` : 'SUCCESS'
      setResult(prev => prev + `✅ Database connection: ${dbResult}\n`)
      console.log('Database test result:', dbResult)

      // Test 2: Check auth settings
      console.log('Testing auth session...')
      const { data: session } = await supabase.auth.getSession()
      const authResult = session ? 'Active' : 'None'
      setResult(prev => prev + `✅ Auth session: ${authResult}\n`)
      console.log('Auth test result:', authResult)

      // Test 3: Try a simple signup with detailed error
      console.log('Testing signup...')
      setResult(prev => prev + 'Testing signup...\n')
      
      const testEmail = `test${Date.now()}@example.com`
      console.log('Using test email:', testEmail)
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
      })

      console.log('Signup result:', { signupData, signupError })

      if (signupError) {
        setResult(prev => prev + `❌ Signup failed: ${signupError.message}\n`)
        setResult(prev => prev + `   Error code: ${signupError.status}\n`)
        setResult(prev => prev + `   Full error: ${JSON.stringify(signupError, null, 2)}\n`)
      } else {
        setResult(prev => prev + `✅ Signup successful: User ID ${signupData.user?.id}\n`)
      }

    } catch (error: any) {
      console.error('Test error:', error)
      setResult(prev => prev + `❌ Test failed: ${error.message}\n`)
    }
    
    setLoading(false)
    console.log('Test completed!')
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <button
        onClick={() => {
          console.log('Button clicked!')
          alert('Button clicked! Check console for details.')
          testConnection()
        }}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Supabase Connection'}
      </button>

      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded whitespace-pre-wrap text-sm">
          {result}
        </pre>
      )}
    </div>
  )
}