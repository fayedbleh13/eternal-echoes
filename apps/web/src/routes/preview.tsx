import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Heart, Music, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/preview')({
  component: PreviewPage,
})

function PreviewPage() {
  const [data, setData] = useState<{
    title: string
    recipientName: string
    content: string
    youtubeUrl: string
    mediaUrls: string[]
  } | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('capsule_preview')
    if (raw) {
      setData(JSON.parse(raw))
    }
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <p className="font-serif italic text-lg" style={{ color: 'var(--text-secondary)' }}>No preview data found.</p>
        <a href="/compose" className="mt-4 text-sm text-red-500 hover:underline">Back to compose</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3" style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <a href="/compose" className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" />
          Back to compose
        </a>
        <span className="text-xs uppercase tracking-widest text-red-500 font-semibold">Preview</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl mx-auto pt-8 pb-8 flex flex-col items-center"
        >
          <Heart className="text-red-700 dark:text-red-500 w-10 h-10 mb-4 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-serif italic text-center" style={{ color: 'var(--text-primary)' }}>{data.title}</h1>
          <p className="mt-2 font-serif italic text-sm" style={{ color: 'var(--text-secondary)' }}>A memory for {data.recipientName}</p>
        </motion.div>

        {data.youtubeUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-xl mx-auto flex items-center justify-center gap-2 mb-8 font-serif text-sm"
          >
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-red-700 dark:text-red-400"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <Music className="w-4 h-4 animate-pulse" /> Background Echo Attached
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ y: -100, scaleY: 0.3, opacity: 0, rotateX: -30 }}
          animate={{ y: 0, scaleY: 1, opacity: 1, rotateX: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-xl mx-auto px-8 py-16 sm:px-16 sm:py-20 bg-[#fcf9f2] text-zinc-900 relative shadow-2xl"
          style={{
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3), inset 0 0 60px rgba(0,0,0,0.03)',
            backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(0,0,0,0.02))',
            transformOrigin: 'top center'
          }}
        >
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-color-burn" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />

          <div className="relative z-10">
            <div className="text-xl leading-loose whitespace-pre-wrap font-serif text-zinc-800">
              <p className="text-lg leading-relaxed">
                {data.content || 'Your message will appear here...'}
              </p>
            </div>

            {data.mediaUrls?.length > 0 && (
              <div className="mt-16 flex flex-col gap-8">
                {data.mediaUrls.map((url: string, i: number) => (
                  <div key={i} className="p-3 bg-white shadow-xl rotate-[1deg] hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto w-full">
                    <img src={url} className="w-full h-auto object-cover opacity-90 sepia-[0.1]" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-24 text-center">
              <p className="font-serif italic text-xs mb-4 text-zinc-600">Preserved via Eternal Echoes</p>
              <div className="w-16 h-px bg-zinc-400 mx-auto" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
