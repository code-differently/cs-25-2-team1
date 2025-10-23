// src/app/signup/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    console.log('Signup result:', { data, error })

    if (error) {
      console.error('Signup error:', error)
      setMessage(`Signup failed: ${error.message}`)
    } else {
      setMessage('Account created successfully! Check your email to confirm your account.')
      // The useEnsureProfile hook in layout.tsx will automatically create the profile
      // when the user confirms their email and gets a session
      setTimeout(() => router.push('/login'), 3000)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-black">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-6">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" 
            className="w-full px-3 py-2 border rounded-md"
            required 
            disabled={loading}
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" 
            className="w-full px-3 py-2 border rounded-md"
            required 
            disabled={loading}
          />
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        {message && (
          <p className={`text-center ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <p className="text-center">
          Already have an account?{' '}
          <button onClick={() => router.push('/login')} className="text-blue-600 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  )
}