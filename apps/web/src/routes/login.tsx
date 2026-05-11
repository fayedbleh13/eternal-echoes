import { createFileRoute, Navigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { authClient, useSession } from '~/utils/auth-client'
import { LogIn, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react'

// Google Icon Component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { data: session, isPending: sessionPending } = useSession()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSocialLogin = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/dashboard`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: `${window.location.origin}/dashboard`
        })
        if (error) setError(error.message || 'Login failed')
      } else {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: `${window.location.origin}/dashboard`
        })
        if (error) setError(error.message || 'Signup failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (session) return <Navigate to="/dashboard" />

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card"
        style={{ borderColor: 'rgba(139, 29, 29, 0.2)' }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
               style={{ 
                 background: 'linear-gradient(to bottom right, #991b1b, #8B1D1D)',
                 boxShadow: '0 20px 40px -10px rgba(139, 29, 29, 0.4)'
               }}>
            {isLogin ? <LogIn className="text-white w-8 h-8" /> : <UserPlus className="text-white w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-serif italic mb-2" style={{ color: 'var(--text-primary)' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
            {isLogin ? 'Authenticate to access your private vault.' : 'Begin your journey of preserving memories.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" 
                        style={{ color: 'var(--text-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all focus:ring-2 focus:ring-red-500/20"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--text-primary)'
                    }}
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                  style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all focus:ring-2 focus:ring-red-500/20"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-primary)'
              }}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                  style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl py-3 pl-12 pr-4 focus:outline-none transition-all focus:ring-2 focus:ring-red-500/20"
              style={{
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-primary)'
              }}
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg text-xs"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#dc2626' }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || sessionPending}
            className="w-full text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ 
              backgroundColor: '#8B1D1D',
              boxShadow: '0 10px 30px -10px rgba(139, 29, 29, 0.4)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#991b1b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B1D1D'}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: '1px solid var(--border-color)' }}></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="px-4" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-tertiary)' }}>OR</span>
          </div>
        </div>

        <button
          onClick={handleSocialLogin}
          disabled={loading || sessionPending}
          className="w-full flex items-center justify-center gap-3 font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'
            e.currentTarget.style.borderColor = 'var(--brand-red)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
            e.currentTarget.style.borderColor = 'var(--border-color)'
          }}
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </button>

        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
          }}
          className="w-full mt-6 text-sm transition-colors hover:text-red-600"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </button>

        <p className="mt-8 text-[10px] uppercase tracking-widest text-center" style={{ color: 'var(--text-tertiary)' }}>
          Secure • Permanent • Private
        </p>
      </motion.div>
    </div>
  )
}
