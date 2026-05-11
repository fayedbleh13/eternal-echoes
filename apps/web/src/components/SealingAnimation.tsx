import { motion, AnimatePresence } from 'framer-motion'
import { Send, Lock, CheckCircle2 } from 'lucide-react'

interface SealingAnimationProps {
  isVisible: boolean
  onComplete?: () => void
}

export function SealingAnimation({ isVisible, onComplete }: SealingAnimationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="relative w-full max-w-md h-96 flex flex-col items-center justify-center">
            {/* Letter Paper */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ 
                y: [100, 0, -20, -50], 
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 0.9, 0.7]
              }}
              transition={{ 
                duration: 2.5, 
                times: [0, 0.3, 0.6, 1],
                ease: 'easeInOut'
              }}
              className="absolute w-48 h-64 rounded-lg shadow-2xl flex items-center justify-center"
              style={{ 
                backgroundColor: '#fcf9f2',
                border: '1px solid #e5e0d8',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Paper texture */}
              <div className="absolute inset-0 opacity-30" 
                   style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
              {/* Letter content hint */}
              <div className="p-4 space-y-2 w-full">
                <div className="h-2 bg-red-200/50 rounded w-3/4" />
                <div className="h-2 bg-red-200/30 rounded w-full" />
                <div className="h-2 bg-red-200/30 rounded w-5/6" />
                <div className="h-2 bg-red-200/30 rounded w-4/5" />
                <div className="mt-4 h-2 bg-red-200/50 rounded w-1/2 ml-auto" />
              </div>
              {/* Wax seal on letter */}
              <motion.div 
                className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Send className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>

            {/* Capsule Container */}
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ 
                y: [300, 100, 50, 0],
                opacity: [0, 1, 1, 1]
              }}
              transition={{ 
                duration: 2.5,
                times: [0, 0.3, 0.5, 0.7],
                ease: 'easeOut'
              }}
              className="absolute w-56 h-72 rounded-3xl overflow-hidden"
              style={{ 
                background: 'linear-gradient(145deg, rgba(139, 29, 29, 0.3), rgba(139, 29, 29, 0.1))',
                border: '2px solid rgba(139, 29, 29, 0.5)',
                boxShadow: '0 25px 50px -12px rgba(139, 29, 29, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Capsule inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent" />
              
              {/* Capsule lid */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [-50, -80, 0] }}
                transition={{ 
                  duration: 2.5,
                  times: [0.3, 0.5, 0.9],
                  ease: 'easeInOut'
                }}
                className="absolute top-0 left-0 right-0 h-20 rounded-t-3xl"
                style={{ 
                  background: 'linear-gradient(180deg, rgba(139, 29, 29, 0.4), rgba(139, 29, 29, 0.2))',
                  borderBottom: '1px solid rgba(139, 29, 29, 0.5)'
                }}
              >
                {/* Lid handle */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full bg-red-800/50" />
              </motion.div>

              {/* Lock indicator */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.5, type: 'spring' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center"
              >
                <Lock className="w-8 h-8 text-red-400" />
              </motion.div>

              {/* Success checkmark */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.5, type: 'spring' }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-xs text-green-400 font-medium">Sealed & Preserved</span>
              </motion.div>
            </motion.div>

            {/* Glow effect when sealing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1.5, 2] }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute w-64 h-64 rounded-full bg-red-500/30 blur-3xl"
            />

            {/* Text animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
              transition={{ delay: 2.3, duration: 0.8 }}
              className="absolute -bottom-20 text-center"
            >
              <p className="text-white font-serif italic text-lg">Your memory is now preserved</p>
              <p className="text-white/60 text-sm mt-1">Secured in the eternal capsule</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
