import { motion } from 'framer-motion'
import { Clock, Lock, Heart } from 'lucide-react'

interface CapsuleContainerProps {
  title: string
  recipientName: string
  deliveryDate: string | null
  onOpen: () => void
}

export function CapsuleContainer({ title, recipientName, deliveryDate, onOpen }: CapsuleContainerProps) {
  const now = new Date()
  const delDate = deliveryDate ? new Date(deliveryDate) : null
  const canOpen = !delDate || now >= delDate

  return (
    <div className="relative w-64 h-80 sm:w-80 sm:h-96 cursor-pointer" onClick={canOpen ? onOpen : undefined}>
      {/* Glow effect */}
      <motion.div
        animate={{ 
          opacity: canOpen ? [0.3, 0.6, 0.3] : 0.2,
          scale: canOpen ? [1, 1.05, 1] : 1
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-3xl blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, rgba(139, 29, 29, 0.4), transparent 70%)',
        }}
      />

      {/* Capsule Body */}
      <motion.div
        whileHover={canOpen ? { scale: 1.02 } : {}}
        whileTap={canOpen ? { scale: 0.98 } : {}}
        className="absolute inset-0 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(139, 29, 29, 0.4), rgba(88, 28, 28, 0.2))',
          border: '2px solid rgba(139, 29, 29, 0.5)',
          boxShadow: '0 25px 50px -12px rgba(139, 29, 29, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/10 to-red-900/20" />
        
        {/* Top lid line */}
        <div className="absolute top-0 left-0 right-0 h-24 rounded-t-3xl"
             style={{
               background: 'linear-gradient(180deg, rgba(139, 29, 29, 0.3), transparent)',
               borderBottom: '1px solid rgba(139, 29, 29, 0.3)'
             }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          {/* Wax seal */}
          <motion.div
            animate={canOpen ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 rounded-full mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.8), rgba(153, 27, 27, 0.9))',
              boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)'
            }}
          >
            {canOpen ? (
              <Heart className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </motion.div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-serif italic mb-2" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>For {recipientName}</p>

          {/* Status */}
          <div className="flex items-center gap-2 text-xs mt-4"
               style={{ color: canOpen ? '#f87171' : 'var(--text-tertiary)' }}>
            {canOpen ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="uppercase tracking-widest font-medium">Ready to Open</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" />
                <span className="uppercase tracking-widest">Locked Until {delDate?.toLocaleDateString()}</span>
              </>
            )}
          </div>

          {/* Click hint */}
          {canOpen && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-6 text-[10px] uppercase tracking-widest"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Click to Unlock
            </motion.p>
          )}
        </div>

        {/* Decorative rings */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-red-900/30" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-0.5 rounded-full bg-red-900/20" />
      </motion.div>

      {/* Floating particles */}
      {canOpen && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-400/60"
              initial={{ 
                x: 128 + (Math.random() - 0.5) * 100,
                y: 192 + (Math.random() - 0.5) * 100,
                opacity: 0 
              }}
              animate={{ 
                y: [null, -100],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeOut'
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
