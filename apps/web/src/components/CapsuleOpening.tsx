import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface CapsuleOpeningProps {
  isVisible: boolean
  onComplete?: () => void
}

export function CapsuleOpening({ isVisible, onComplete }: CapsuleOpeningProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        >
          <div className="relative w-80 h-96">
            {/* Capsule Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(139, 29, 29, 0.5), rgba(88, 28, 28, 0.3))',
                border: '2px solid rgba(139, 29, 29, 0.6)',
                boxShadow: '0 25px 50px -12px rgba(139, 29, 29, 0.6)'
              }}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 to-transparent" />
              
              {/* Capsule lid */}
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: -150, rotateX: -30 }}
                transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                className="absolute top-0 left-0 right-0 h-28 rounded-t-3xl origin-bottom"
                style={{
                  background: 'linear-gradient(180deg, rgba(139, 29, 29, 0.5), rgba(139, 29, 29, 0.3))',
                  borderBottom: '2px solid rgba(139, 29, 29, 0.6)',
                  boxShadow: '0 4px 20px rgba(139, 29, 29, 0.3)'
                }}
              >
                {/* Lid handle */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 rounded-full bg-red-800/60" />
              </motion.div>

              {/* Center heart/seal */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, rgba(220, 38, 38, 0.9), rgba(153, 27, 27, 1))',
                  boxShadow: '0 8px 20px rgba(220, 38, 38, 0.5)'
                }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>

              {/* Light beam from inside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.8] }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full"
                style={{
                  background: 'linear-gradient(180deg, rgba(255, 200, 150, 0.6), transparent)',
                  filter: 'blur(20px)'
                }}
              />

              {/* Unlocked text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <p className="text-white font-serif italic text-lg">Unlocked</p>
              </motion.div>
            </motion.div>

            {/* Sparkles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, -Math.random() * 150 - 50]
                }}
                transition={{ 
                  delay: 1 + i * 0.1,
                  duration: 1.5,
                  ease: 'easeOut'
                }}
                className="absolute top-1/2 left-1/2"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            ))}

            {/* Glow burst */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 3], opacity: [0, 0.6, 0] }}
              transition={{ delay: 1, duration: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-red-500/40 blur-3xl"
            />
          </div>

          {/* Completion callback */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 2.5, duration: 0.1 }}
            onAnimationComplete={onComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
