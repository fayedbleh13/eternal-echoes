import { motion } from 'framer-motion'

export function AnimatedEnvelope() {
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* Floating particles around envelope */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-3 rounded-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 29, 29, 0.3), rgba(139, 29, 29, 0.1))',
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Envelope Container */}
      <motion.div
        className="relative"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Envelope Body */}
        <motion.div
          className="relative w-48 h-36 sm:w-56 sm:h-44 lg:w-64 lg:h-52"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Envelope Back */}
          <div 
            className="absolute inset-0 rounded-lg shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 50%, #d8d0c0 100%)',
              boxShadow: '0 25px 50px -12px rgba(139, 29, 29, 0.25), 0 0 0 1px rgba(139, 29, 29, 0.1)',
            }}
          />

          {/* Envelope Flap (Top Triangle) */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 overflow-hidden"
            style={{ originY: 0 }}
            animate={{ rotateX: [0, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <div 
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, #f8f4e8 0%, #ebe5d8 100%)',
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                boxShadow: 'inset 0 2px 4px rgba(139, 29, 29, 0.05)',
              }}
            />
          </motion.div>

          {/* Envelope Bottom Flaps */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2">
            {/* Left flap */}
            <div 
              className="absolute bottom-0 left-0 w-1/2 h-full"
              style={{
                background: 'linear-gradient(135deg, #e5ddd0 0%, #d5cdc0 100%)',
                clipPath: 'polygon(0 100%, 100% 0, 0 0)',
              }}
            />
            {/* Right flap */}
            <div 
              className="absolute bottom-0 right-0 w-1/2 h-full"
              style={{
                background: 'linear-gradient(225deg, #e5ddd0 0%, #d5cdc0 100%)',
                clipPath: 'polygon(100% 100%, 100% 0, 0 0)',
              }}
            />
          </div>

          {/* Wax Seal */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 z-10"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 4px 15px rgba(139, 29, 29, 0.3)',
                '0 6px 25px rgba(139, 29, 29, 0.5)',
                '0 4px 15px rgba(139, 29, 29, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #a52a2a, #8B1D1D, #5c1212)',
                boxShadow: '0 4px 15px rgba(139, 29, 29, 0.4), inset 0 2px 4px rgba(255,255,255,0.2)',
              }}
            >
              {/* Heart icon on seal */}
              <svg 
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white/90" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </motion.div>

          {/* Paper peeking out top */}
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-40 sm:w-48 lg:w-56 h-8 sm:h-10"
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <div 
              className="w-full h-full rounded-t-sm shadow-sm"
              style={{
                background: 'linear-gradient(180deg, #fffefb 0%, #faf8f3 100%)',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
              }}
            >
              {/* Decorative lines on paper */}
              <div className="pt-2 px-4 space-y-1">
                <div className="h-0.5 w-3/4 bg-red-900/10 rounded" />
                <div className="h-0.5 w-1/2 bg-red-900/10 rounded" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Reflection/glow beneath */}
        <motion.div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 sm:w-40 lg:w-48 h-4 rounded-full blur-xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scaleX: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: 'radial-gradient(ellipse, rgba(139, 29, 29, 0.3), transparent)',
          }}
        />
      </motion.div>

      {/* Animated text beneath envelope */}
      <motion.div
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.p
          className="font-serif italic text-sm sm:text-base"
          style={{ color: 'var(--text-tertiary)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          A sealed promise, waiting in time...
        </motion.p>
      </motion.div>
    </div>
  )
}
