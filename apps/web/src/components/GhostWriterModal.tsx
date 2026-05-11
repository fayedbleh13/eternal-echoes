import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, X, Sparkles, PenLine } from 'lucide-react'

interface GhostWriterModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (prompt: string, tone: string) => void
  isLoading: boolean
}

export function GhostWriterModal({ isOpen, onClose, onGenerate, isLoading }: GhostWriterModalProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedTone, setSelectedTone] = useState('warm and reflective')

  const tones = [
    { value: 'warm and reflective', label: 'Warm & Reflective', desc: 'Heartfelt and nostalgic' },
    { value: 'romantic and passionate', label: 'Romantic', desc: 'Deeply emotional and loving' },
    { value: 'grateful and appreciative', label: 'Grateful', desc: 'Thankful and appreciative' },
    { value: 'encouraging and hopeful', label: 'Encouraging', desc: 'Uplifting and inspiring' },
    { value: 'playful and light', label: 'Playful', desc: 'Fun and cheerful' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    onGenerate(prompt, selectedTone)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                 style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
              {/* Header */}
              <div className="px-6 py-4 border-b flex items-center justify-between"
                   style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-lg" style={{ color: 'var(--text-primary)' }}>
                      Echo Ghost Writer
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      AI-powered letter generation
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Instructions */}
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex items-start gap-3">
                    <PenLine className="w-5 h-5 mt-0.5 text-red-600" />
                    <div>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                        How it works
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Describe what you want to write about, and the Ghost Writer will craft a beautiful letter for you. 
                        You can then edit it to make it your own.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    What would you like to write about?
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: I want to write to my daughter about her childhood memories, how proud I am of her, and my hopes for her future..."
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-all outline-none"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      minHeight: '120px'
                    }}
                  />
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Select a tone
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tones.map((tone) => (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() => setSelectedTone(tone.value)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          selectedTone === tone.value 
                            ? 'ring-2 ring-red-600' 
                            : 'hover:bg-red-50/50 dark:hover:bg-red-950/10'
                        }`}
                        style={{ 
                          border: selectedTone === tone.value ? '1px solid #dc2626' : '1px solid var(--border-color)',
                          backgroundColor: selectedTone === tone.value 
                            ? 'rgba(220, 38, 38, 0.08)' 
                            : 'var(--bg-secondary)'
                        }}
                      >
                        <p className="text-sm font-semibold" style={{ 
                          color: selectedTone === tone.value ? '#991b1b' : 'var(--text-primary)' 
                        }}>
                          {tone.label}
                        </p>
                        <p className="text-xs" style={{ 
                          color: selectedTone === tone.value ? '#b91c1c' : 'var(--text-tertiary)' 
                        }}>
                          {tone.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--bg-tertiary)', 
                      color: 'var(--text-secondary)' 
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="flex-[2] px-4 py-3 rounded-xl text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#8B1D1D' }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Crafting your letter...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Generate Letter
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
