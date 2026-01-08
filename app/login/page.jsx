'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Mail, Lock, Chrome } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid email or password')
      } else if (res?.url) {
        window.location.href = res.url
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true)
    await signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="relative min-h-screen bg-[#070B14] text-white">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-purple-500/20 to-sky-500/20 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-140px] h-[420px] w-[420px] rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Logo/Title */}
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold text-white">PocketHistory</h1>
            <p className="mt-4 text-xl text-gray-400">Track your expenses, build habits</p>
          </div>

          {/* Form Container with subtle glass effect */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
            <h2 className="mb-8 text-3xl font-semibold text-white">Welcome back</h2>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="mb-8 flex w-full items-center justify-center gap-3 rounded-lg border border-white/20 bg-white/10 px-6 py-4 text-lg text-white transition hover:bg-white/20 disabled:opacity-50"
            >
              <Chrome size={24} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="mb-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-sm text-gray-400">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-base font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-base text-white placeholder-gray-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-base font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-base text-white placeholder-gray-500 outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-6 py-4 text-lg font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-base text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
