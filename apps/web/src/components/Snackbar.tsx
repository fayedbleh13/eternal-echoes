import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'

interface SnackbarProps {
  message: string
  isOpen: boolean
  onClose: () => void
  duration?: number
  type?: 'error' | 'success' | 'info'
}

export function Snackbar({ message, isOpen, onClose, duration = 5000, type = 'error' }: SnackbarProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isOpen) {
      setProgress(100)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        onClose()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isOpen, duration, onClose])

  const bgColors = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-blue-600',
  }

  const iconColors = {
    error: 'text-red-100',
    success: 'text-green-100',
    info: 'text-blue-100',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div 
            className={`${bgColors[type]} text-white px-6 py-4 rounded-xl shadow-2xl min-w-[320px] max-w-[480px]`}
            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColors[type]}`} />
              <p className="text-sm font-medium flex-1">{message}</p>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white/60 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
