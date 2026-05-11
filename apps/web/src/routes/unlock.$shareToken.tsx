import { createFileRoute } from '@tanstack/react-router'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CapsuleContainer } from '~/components/CapsuleContainer'
import { ThreeEnvelope } from '~/components/ThreeEnvelope'
import { Play, Pause, Music, Lock, Heart, Calendar, Clock, Repeat, Repeat1 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const GET_UNLOCKED_CAPSULE = gql`
  query GetUnlockedCapsule($shareToken: String!) {
    unlockedCapsule(shareToken: $shareToken) {
      id
      title
      status
      deliveryDate
      recipientName
      letters {
        id
        title
        content
        youtubeUrl
        mediaUrls
        createdAt
      }
    }
  }
`

export const Route = createFileRoute('/unlock/$shareToken')({
  component: UnlockPage,
})

function UnlockPage() {
  const { shareToken } = Route.useParams()
  const { data, loading, error } = useQuery<{ unlockedCapsule: any }>(GET_UNLOCKED_CAPSULE, {
    variables: { shareToken },
  })

  const [isOpened, setIsOpened] = useState(false)
  const [showEnvelope, setShowEnvelope] = useState(true)
  const [showLetter, setShowLetter] = useState(false)
  const [canOpen, setCanOpen] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isPlaying, setIsPlaying] = useState(true)
  const [repeatMode, setRepeatMode] = useState<'off' | 'loop' | 'one'>('off')
  const [meta, setMeta] = useState<{ title: string; author: string } | null>(null)
  
  const capsule = data?.unlockedCapsule
  const letter = capsule?.letters?.[0]
  const youtubeId = letter?.youtubeUrl ? extractYoutubeId(letter.youtubeUrl) : null
  const playerSrc = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&autoplay=1&controls=0&origin=${window.location.origin}${repeatMode !== 'off' ? `&loop=1&playlist=${youtubeId}` : ''}`
    : ''

  useEffect(() => {
    if (letter?.youtubeUrl) {
      fetch(`https://noembed.com/embed?url=${encodeURIComponent(letter.youtubeUrl)}`)
        .then(res => res.json())
        .then(d => setMeta({ title: cleanTitle(d.title), author: d.author_name }))
        .catch(() => setMeta(null))
    }
  }, [letter])

  useEffect(() => {
    if (capsule) {
      const now = new Date()
      const delDate = capsule.deliveryDate ? new Date(capsule.deliveryDate) : null
      if (!delDate || now >= delDate) {
        setCanOpen(true)
      } else {
        setCanOpen(false)
      }
    }
  }, [capsule])

  const handleOpen = () => {
    if (!canOpen) return
    
    // Animation sequence: envelope slides down, letter emerges and unfolds
    setShowEnvelope(false)
    
    // After envelope slides down, show letter emerging
    setTimeout(() => {
      setShowLetter(true)
      setIsOpened(true)
    }, 800)
  }

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (!e.origin.includes('youtube.com')) return
      try {
        const data = JSON.parse(e.data)
        if (data.event === 'onStateChange') {
          const state = data.info
          if (state === 0) {
            setIsPlaying(false)
          } else if (state === 1) {
            setIsPlaying(true)
          } else if (state === 2) {
            setIsPlaying(false)
          }
        }
      } catch {}
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    const iframe = document.getElementById('echo-player') as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [volume]
      }), '*')
      
      iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: isPlaying ? 'playVideo' : 'pauseVideo'
      }), '*')
    }
  }, [volume, isPlaying])

  if (loading) return (
     <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="w-12 h-12 border-2 border-red-900 border-t-red-500 rounded-full animate-spin" />
     </div>
  )

  if (error || !capsule) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Lock className="w-12 h-12 mb-4" style={{ color: 'var(--text-tertiary)' }} />
      <h1 className="text-2xl font-serif italic mb-2" style={{ color: 'var(--text-primary)' }}>Echo Not Found</h1>
      <p style={{ color: 'var(--text-secondary)' }}>This capsule may have been deleted or the link is invalid.</p>
    </div>
  )

  return (
    <div className={isOpened ? "flex-1 relative theme-transition overflow-hidden" : "flex flex-col items-center justify-center theme-transition"} style={{ backgroundColor: 'var(--bg-primary)', height: 'calc(100vh - 140px)' }}>
      {/* Cinematic YouTube Player */}
      {isOpened && letter?.youtubeUrl && (
         <div className="fixed opacity-0 pointer-events-none">
            <iframe 
              id="echo-player"
              src={playerSrc} 
              allow="autoplay"
            />
         </div>
      )}

      {/* Audio Control Bar (Top Right - Slides in with letter) */}
      <AnimatePresence>
        {isOpened && meta && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
            className="fixed top-24 right-4 z-50"
          >
            <div className="glass-card flex flex-col gap-2 py-3 px-5 rounded-2xl"
                 style={{ borderColor: 'rgba(139, 29, 29, 0.2)' }}>
              <div className="flex items-center gap-2 min-w-0">
                <Music className="w-3 h-3 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {meta.title}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setRepeatMode(prev => prev === 'off' ? 'loop' : prev === 'loop' ? 'one' : 'off')}
                  className="transition-colors"
                  style={{ color: repeatMode !== 'off' ? '#ef4444' : 'var(--text-tertiary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = repeatMode !== 'off' ? '#ef4444' : 'var(--text-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = repeatMode !== 'off' ? '#ef4444' : 'var(--text-tertiary)'}
                >
                  {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>
                <div className="h-4 w-px" style={{ backgroundColor: 'var(--border-color)' }} />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 accent-red-600 h-1 rounded-full cursor-pointer appearance-none"
                  style={{ backgroundColor: 'var(--bg-tertiary)' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={isOpened ? "absolute inset-0 z-0" : "z-0"} style={{ height: isOpened ? '100%' : 'auto' }}>
        {/* ─── LAYER 1: Full Letter Content — appears after envelope animation ─── */}
        <AnimatePresence>
          {isOpened && (
            <div className="absolute inset-0 overflow-y-auto px-4 pb-24">
              <motion.div
                key="letter-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                className="w-full max-w-xl mx-auto pt-24 pb-8 flex flex-col items-center"
              >
                <Heart className="text-red-700 dark:text-red-500 w-10 h-10 mb-4 opacity-80" />
                <h1 className="text-4xl md:text-5xl font-serif italic text-center" style={{ color: 'var(--text-primary)' }}>{letter.title || capsule.title}</h1>
                <p className="mt-2 font-serif italic text-sm" style={{ color: 'var(--text-secondary)' }}>A memory for {capsule.recipientName}</p>
              </motion.div>

              <motion.div
                key="letter-meta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="w-full max-w-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-center gap-4 mb-8 font-serif text-sm"
              >
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                  <Calendar className="w-4 h-4" /> {new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                {letter.youtubeUrl && (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full text-red-700 dark:text-red-400"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                    <Music className="w-4 h-4 animate-pulse" /> Background Echo Playing
                  </span>
                )}
              </motion.div>

              {/* Letter Paper with Unfolding Animation */}
              <motion.div
                key="unlocked-paper"
                initial={{ 
                  y: -100,
                  scaleY: 0.3, 
                  opacity: 0,
                  rotateX: -30
                }}
                animate={showLetter ? { 
                  y: 0,
                  scaleY: 1, 
                  opacity: 1,
                  rotateX: 0
                } : {}}
                transition={{ 
                  duration: 1.2, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="w-full max-w-xl mx-auto px-8 py-16 sm:px-16 sm:py-20 bg-[#fcf9f2] text-zinc-900 relative shadow-2xl"
                style={{
                  boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3), inset 0 0 60px rgba(0,0,0,0.03)',
                  backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.4), rgba(0,0,0,0.02))',
                  transformOrigin: 'top center'
                }}
              >
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-color-burn" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
                
                {/* Fold lines - fade out as letter unfolds */}
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  animate={showLetter ? { opacity: 0.1 } : {}}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="absolute top-1/3 left-0 right-0 h-px bg-zinc-400/50" 
                />
                <motion.div 
                  initial={{ opacity: 0.8 }}
                  animate={showLetter ? { opacity: 0.1 } : {}}
                  transition={{ duration: 1.5, delay: 0.7 }}
                  className="absolute top-2/3 left-0 right-0 h-px bg-zinc-400/50" 
                />
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={showLetter ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl leading-loose whitespace-pre-wrap font-serif text-zinc-800"
                  >
                    <p className="text-lg leading-relaxed">
                      {letter.content}
                    </p>
                  </motion.div>
                  
                  {letter.mediaUrls?.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={showLetter ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="mt-16 flex flex-col gap-8"
                    >
                      {letter.mediaUrls.map((url: string, i: number) => (
                        <div key={i} className="p-3 bg-white shadow-xl rotate-[1deg] hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto w-full">
                          <img src={url} className="w-full h-auto object-cover opacity-90 sepia-[0.1]" />
                        </div>
                      ))}
                    </motion.div>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={showLetter ? { opacity: 0.4 } : {}}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-24 text-center"
                  >
                    <p className="font-serif italic text-xs mb-4 text-zinc-600">Preserved via Eternal Echoes</p>
                    <div className="w-16 h-px bg-zinc-400 mx-auto" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── LAYER 2: Capsule or Envelope based on state ─── */}
        <AnimatePresence mode="wait">
          {/* LOCKED STATE: Show centered CapsuleContainer */}
          {!canOpen && !isOpened && (
            <motion.div
              key="locked-capsule"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="z-30 flex flex-col items-center justify-center px-4"
            >
              <div className="text-center mb-4">
                <h1 className="text-lg font-serif italic" style={{ color: 'var(--text-primary)' }}>{capsule.title}</h1>
                <p className="tracking-[0.1em] uppercase text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>A memory for {capsule.recipientName}</p>
              </div>

              <div>
                <div className="w-[150px] h-[150px]">
                  <CapsuleContainer 
                    title={capsule.title}
                    recipientName={capsule.recipientName}
                    deliveryDate={capsule.deliveryDate}
                    onOpen={handleOpen}
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-4"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Clock className="text-red-500 w-4 h-4 animate-pulse" />
                  <p className="font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Unlocked in {capsule.deliveryDate ? formatDistanceToNow(new Date(capsule.deliveryDate)) : '...'}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Patience is the foundation of legacy</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* READY STATE: Show ThreeEnvelope */}
          {canOpen && showEnvelope && !isOpened && (
            <motion.div
              key="ready-envelope"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: 400 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="z-30 flex flex-col items-center justify-center px-4 pointer-events-none"
            >
              <div className="text-center pointer-events-auto mb-4">
                <h1 className="text-lg font-serif italic" style={{ color: 'var(--text-primary)' }}>{capsule.title}</h1>
                <p className="tracking-[0.1em] uppercase text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>A memory for {capsule.recipientName}</p>
              </div>

              <div className="pointer-events-auto">
                <div className="w-[600px] h-[460px] max-w-full">
                  <ThreeEnvelope onOpen={handleOpen} />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="text-center pointer-events-auto mt-4"
              >
                <p className="font-serif italic tracking-widest uppercase text-[10px] px-3 py-1 rounded-full bg-red-50 border border-red-100" style={{ color: 'var(--text-tertiary)' }}>Click the wax seal to open</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function cleanTitle(title: string) {
  return title.replace(/\s*\((?:(?:Official|Lyric|Music)?\s*Video|Lyrics|Audio|128kbps|HQ|HD|Official)\)|\s*-\s*(?:Single|Topic)\s*$/gi, '').trim()
}

function extractYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
