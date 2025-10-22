// src/app/signup/page.tsx
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)
    
    if (error) {
      setMessage(error.message)
    } else if (data.user) {
      setMessage('Check your email to confirm your account!')
      // Optionally redirect after a delay
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
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