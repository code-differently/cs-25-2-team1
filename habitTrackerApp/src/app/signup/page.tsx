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
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5B4CCC] to-[#4A3AB8] items-center justify-center p-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl font-bold text-[#5B4CCC]">S</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Streakr</h1>
          <p className="text-xl text-white/90 mb-8">Build habits that stick</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            <div className="w-3 h-3 rounded-full bg-white/50"></div>
            <div className="w-3 h-3 rounded-full bg-white/50"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-[#5B4CCC] rounded-full flex items-center justify-center shadow-md">
              <span className="text-4xl font-bold text-white">S</span>
            </div>
            <span className="ml-3 text-3xl font-bold text-[#5B4CCC]">Streakr</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600 mb-8">Start building better habits today</p>
            
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5B4CCC] focus:border-transparent outline-none transition-all text-gray-900"
                  required 
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5B4CCC] focus:border-transparent outline-none transition-all text-gray-900"
                  required 
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 px-4 bg-[#2B9BFF] text-white font-semibold rounded-xl hover:bg-[#1E8AEE] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {message && (
              <div className={`mt-5 p-4 rounded-xl ${
                message.includes('error') || message.includes('Error')
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-green-50 border border-green-200 text-green-700'
              }`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => router.push('/login')} 
                  className="text-[#5B4CCC] font-semibold hover:text-[#4A3AB8] transition-colors"
                >
                  Log in
                </button>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-[#5B4CCC] hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#5B4CCC] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}