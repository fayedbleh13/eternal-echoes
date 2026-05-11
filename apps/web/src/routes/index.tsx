import { createFileRoute, Link } from '@tanstack/react-router'
import * as React from 'react'
import { motion } from 'framer-motion'
import { useSession } from '~/utils/auth-client'
import { AnimatedEnvelope } from '~/components/AnimatedEnvelope'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          {/* Small envelope or heart shape */}
          <svg 
            width="20" 
            height="16" 
            viewBox="0 0 24 20" 
            fill="none"
            className="opacity-40"
          >
            <path 
              d="M2 5L12 13L22 5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-red-900 dark:text-red-400"
            />
            <path 
              d="M2 5V15C2 16.1046 2.89543 17 4 17H20C21.1046 17 22 16.1046 22 15V5" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round"
              className="text-red-900 dark:text-red-400"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="relative isolate overflow-hidden theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-900/10 blur-[120px] rounded-full opacity-50" />
        {/* Subtle vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, var(--bg-primary) 70%)',
          }}
        />
      </div>

      {/* Floating particles */}
      <FloatingParticles />

      <div className="mx-auto max-w-7xl px-6 min-h-[calc(100vh-80px)] flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16 xl:gap-24 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl"
        >
          <div className="mt-8 sm:mt-12 lg:mt-0">
            <span className="rounded-full px-3 py-1 text-sm font-semibold leading-6 text-red-600 dark:text-red-400 ring-1 ring-inset ring-red-500/30"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              New: Ghost Writer Pro
            </span>
          </div>
          <h1 className="mt-10 text-4xl font-serif italic tracking-tight sm:text-7xl" style={{ color: 'var(--text-primary)' }}>
            Some words are meant to <br />
            <span className="text-red-700 not-italic uppercase font-mono tracking-tighter">Echo Forever.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 max-w-md" style={{ color: 'var(--text-secondary)' }}>
            The world's premium digital time capsule. Preserve your voice, your photos, and your legacy for the ones you love. 
            Deliverable on any date, anywhere in the future.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {session ? (
              <Link to="/compose" className="btn-primary text-center">
                Compose a Letter
              </Link>
            ) : (
              <Link to="/login" className="btn-primary text-center">
                Begin Your Legacy
              </Link>
            )}
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Free to start · No credit card required
            </p>
          </div>
        </motion.div>

        {/* Animated Envelope Visual */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-20 lg:mt-0 lg:mx-0 lg:flex-shrink-0">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.5, duration: 1.2 }}
               className="rounded-xl p-4 sm:p-6 lg:p-8"
               style={{ 
                 backgroundColor: 'var(--bg-secondary)', 
                 border: '1px solid var(--border-color)',
                 boxShadow: '0 25px 50px -12px rgba(139, 29, 29, 0.15)',
               }}
             >
                <div className="w-[280px] sm:w-[320px] lg:w-[380px] h-[320px] sm:h-[380px] lg:h-[420px] rounded-lg flex items-center justify-center relative"
                     style={{ 
                       background: 'linear-gradient(145deg, rgba(139, 29, 29, 0.05), rgba(139, 29, 29, 0.02))',
                       border: '1px solid var(--border-color)',
                     }}>
                  <AnimatedEnvelope />
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
