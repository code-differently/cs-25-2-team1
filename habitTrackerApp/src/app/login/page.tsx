// src/app/login/page.tsx
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (authError) {
      setError(authError.message)
    } else if (data.user) {
      router.push('/dashboard')
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
          <p className="text-xl text-white/90 mb-8">Welcome back!</p>
          <div className="space-y-4 text-white/80 text-left max-w-sm mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">✓</span>
              </div>
              <p className="text-sm">Track your daily habits effortlessly</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">✓</span>
              </div>
              <p className="text-sm">Build streaks and stay motivated</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm">✓</span>
              </div>
              <p className="text-sm">Visualize your progress over time</p>
            </div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600 mb-8">Log in to continue your streak</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
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
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm text-[#5B4CCC] hover:text-[#4A3AB8] font-medium"
                  >
                    Forgot?
                  </button>
                </div>
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
              </div>

              <div className="flex items-center">
                <input 
                  id="remember"
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-[#5B4CCC] focus:ring-[#5B4CCC]"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me for 30 days
                </label>
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
                    Logging in...
                  </span>
                ) : (
                  'Log In'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {/* Add Google OAuth */}}
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {/* Add GitHub OAuth */}}
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-700">GitHub</span>
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?{' '}
                <button 
                  type="button"
                  onClick={() => router.push('/signup')} 
                  className="text-[#5B4CCC] font-semibold hover:text-[#4A3AB8] transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            Protected by reCAPTCHA and subject to the{' '}
            <a href="#" className="text-[#5B4CCC] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}