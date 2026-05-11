import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useSession } from '~/utils/auth-client'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Image as ImageIcon, Music, Send, CheckCircle2, ChevronRight, ChevronLeft, Lock, Plus, Heart } from 'lucide-react'
import { GhostWriterModal } from '~/components/GhostWriterModal'
import { Snackbar } from '~/components/Snackbar'
import { ImageUpload } from '~/components/ImageUpload'
import { SealingAnimation } from '~/components/SealingAnimation'

const CREATE_CAPSULE = gql`
  mutation CreateCapsule($input: CreateCapsuleInput!) {
    createCapsule(input: $input) {
      id
      shareToken
    }
  }
`

const CREATE_LETTER = gql`
  mutation CreateLetter($input: CreateLetterInput!) {
    createLetter(input: $input) {
      id
    }
  }
`

const GENERATE_SUGGESTION = gql`
  mutation GenerateSuggestion($prompt: String!, $tone: String) {
    generateLetterSuggestion(prompt: $prompt, tone: $tone)
  }
`

export const Route = createFileRoute('/compose')({
  component: ComposePage,
})

function ComposePage() {
  const { data: session, isPending: sessionPending } = useSession()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [ghostWriterOpen, setGhostWriterOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSealing, setIsSealing] = useState(false)
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'info'
  })
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    recipientName: '',
    recipientEmail: '',
    content: '',
    deliveryDate: '',
    youtubeUrl: '',
    mediaUrls: [] as string[]
  })

  const [createCapsule] = useMutation<{ createCapsule: { id: string } }>(CREATE_CAPSULE)
  const [createLetter] = useMutation(CREATE_LETTER)
  const [generateSuggestion] = useMutation<{ generateLetterSuggestion: string }>(GENERATE_SUGGESTION)

  if (sessionPending) return null
  if (!session) return <Navigate to="/login" />

  const showSnackbar = (message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setSnackbar({ isOpen: true, message, type })
  }

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isOpen: false }))
  }

  const handleAIHelp = async (prompt: string, tone: string = 'warm and reflective') => {
    // Close modal immediately and show generating state
    setGhostWriterOpen(false)
    setIsGenerating(true)
    setFormData(prev => ({ ...prev, content: '✨ The Ghost Writer is crafting your letter...' }))
    
    try {
      const { data } = await generateSuggestion({
        variables: { 
          prompt: `${formData.title ? `Title: ${formData.title}. ` : ''}${prompt}`,
          tone: tone
        }
      })
      if (data?.generateLetterSuggestion) {
        setFormData(prev => ({ ...prev, content: data.generateLetterSuggestion }))
        showSnackbar('Letter generated successfully!', 'success')
      }
    } catch (error: any) {
      console.error('AI Generation error:', error)
      setFormData(prev => ({ ...prev, content: '' }))
      const errorMessage = error.message || 'Failed to generate letter. Please try again.'
      showSnackbar(errorMessage, 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSeal = async () => {
    try {
      // 1. Create Capsule
      const { data: capData } = await createCapsule({
        variables: {
          input: {
            title: formData.title,
            recipientName: formData.recipientName,
            recipientEmail: formData.recipientEmail,
            deliveryDate: formData.deliveryDate || null
          }
        }
      })

      const capsuleId = capData?.createCapsule?.id
      if (!capsuleId) throw new Error("Failed to create capsule")

      // 2. Create Letter
      await createLetter({
        variables: {
          input: {
            capsuleId,
            title: formData.title,
            content: formData.content,
            youtubeUrl: formData.youtubeUrl,
            mediaUrls: formData.mediaUrls
          }
        }
      })

      // 3. Show sealing animation
      setIsSealing(true)
      
      // 4. Wait for animation then navigate
      setTimeout(() => {
        navigate({ to: '/dashboard' })
      }, 3500)
    } catch (e) {
      console.error(e)
      showSnackbar('Failed to create capsule. Please try again.', 'error')
    }
  }

  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center px-4 py-0">
      {/* Vertical Stepper */}
      <div className="w-full max-w-5xl flex gap-10">
        {/* Left: Vertical Stepper */}
        <div className="w-36 flex-shrink-0">
          <div className="flex gap-4">
            {/* Column 1: Circles + Progress Line */}
            <div className="w-10 flex flex-col items-center relative">
              {/* Vertical Progress Line */}
              <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5 rounded-full"
                   style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="w-full rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, #dc2626 0%, #ef4444 100%)',
                  }}
                  initial={{ height: '0%' }}
                  animate={{ height: `${((step - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {/* Step Circles */}
              <div className="flex flex-col gap-4 relative z-10">
                {[1, 2, 3, 4].map((num) => {
                  const isCompleted = step > num
                  const isCurrent = step === num

                  return (
                    <motion.div
                      key={num}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: num * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: isCompleted
                          ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                          : isCurrent
                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                            : 'var(--bg-secondary)',
                        border: isCompleted || isCurrent
                          ? 'none'
                          : '2px solid rgba(255,255,255,0.2)',
                        boxShadow: isCurrent
                          ? '0 0 15px rgba(239, 68, 68, 0.2)'
                          : isCompleted
                            ? '0 4px 10px rgba(220, 38, 38, 0.25)'
                            : '0 1px 3px rgba(0,0,0,0.2)',
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                      ) : (
                        <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-zinc-400'}`}>
                          {num}
                        </span>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Column 2: Labels */}
            <div className="flex-1 flex flex-col justify-between py-1">
              {[
                { num: 1, label: 'Words', desc: 'Message' },
                { num: 2, label: 'Media', desc: 'Attachments' },
                { num: 3, label: 'Review', desc: 'Preview' },
                { num: 4, label: 'Delivery', desc: 'Seal' }
              ].map((s) => {
                const isCompleted = step > s.num
                const isCurrent = step === s.num
                const isClickable = !isCurrent && s.num < step

                return (
                  <motion.div
                    key={s.num}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: s.num * 0.1, duration: 0.3 }}
                    className={`py-1 px-3 rounded-lg transition-all duration-200 ${
                      isClickable ? 'cursor-pointer hover:bg-white/[0.06]' : ''
                    }`}
                    onClick={isClickable ? () => setStep(s.num) : undefined}
                    whileHover={isClickable ? { x: 3 } : {}}
                  >
                    <span className={`text-sm font-semibold tracking-wide ${
                      isCurrent ? 'text-red-400' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'
                    }`}>
                      {s.label}
                    </span>
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-600">
                      {s.desc}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right: Main Content Area */}
        <div className="flex-1 flex flex-col rounded-2xl min-h-[520px] max-h-[calc(100vh-140px)] overflow-hidden"
             style={{ 
               backgroundColor: 'var(--card-bg)', 
               border: '1px solid var(--border-color)',
               boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)'
             }}>
        <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-6 h-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs uppercase tracking-widest mb-1 font-bold" style={{ color: 'var(--text-tertiary)' }}>Capsule Title</label>
                   <input
                     placeholder="A letter to my future self..."
                     className="w-full rounded-lg px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-red-500/20"
                     style={{ 
                       backgroundColor: 'var(--input-bg)', 
                       border: '1px solid var(--input-border)',
                       color: 'var(--text-primary)'
                     }}
                     value={formData.title}
                     onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                   />
                </div>
                <div>
                   <label className="block text-xs uppercase tracking-widest mb-1 font-bold" style={{ color: 'var(--text-tertiary)' }}>Recipient Name</label>
                   <input
                     placeholder="Who is this for?"
                     className="w-full rounded-lg px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-red-500/20"
                     style={{ 
                       backgroundColor: 'var(--input-bg)', 
                       border: '1px solid var(--input-border)',
                       color: 'var(--text-primary)'
                     }}
                     value={formData.recipientName}
                     onChange={e => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                   />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--text-tertiary)' }}>The Message</label>
                  <button 
                    onClick={() => setGhostWriterOpen(true)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-xs text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                  >
                    <Wand2 className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Echo Ghost Writer'}
                  </button>
                </div>
                <textarea
                  placeholder="Pour your heart out here..."
                  disabled={isGenerating}
                  className="w-full rounded-lg px-3 py-2 outline-none transition-all min-h-[120px] resize-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: 'var(--input-bg)', 
                    border: '1px solid var(--input-border)',
                    color: isGenerating ? 'var(--text-tertiary)' : 'var(--text-primary)'
                  }}
                  value={formData.content}
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8 flex-1 pb-8"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Music className="text-red-500 w-4 h-4" />
                  <h3 className="text-base font-serif italic" style={{ color: 'var(--text-primary)' }}>Atmospheric Track</h3>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--text-tertiary)' }}>Paste a YouTube URL to set the mood when the letter is opened.</p>
                <input
                   placeholder="https://youtube.com/watch?v=..."
                   className="w-full rounded-lg px-3 py-2 outline-none transition-all focus:ring-2 focus:ring-red-500/20"
                   style={{ 
                     backgroundColor: 'var(--input-bg)', 
                     border: '1px solid var(--input-border)',
                     color: 'var(--text-primary)'
                   }}
                   value={formData.youtubeUrl}
                   onChange={e => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="text-red-500 w-4 h-4" />
                  <h3 className="text-base font-serif italic" style={{ color: 'var(--text-primary)' }}>Visual Memories</h3>
                </div>
                <ImageUpload
                  images={formData.mediaUrls}
                  onImagesChange={(urls) => setFormData(prev => ({ ...prev, mediaUrls: urls }))}
                  onError={(msg) => showSnackbar(msg, 'error')}
                  onSuccess={(msg) => showSnackbar(msg, 'success')}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
               key="step3"
               initial={{ opacity: 0, y: 15, scale: 0.97 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -10, scale: 0.97 }}
               transition={{ duration: 0.35, ease: 'easeOut' }}
               className="flex-1 flex flex-col items-center justify-center py-4"
            >
               {/* Letter Preview - Matching Unlock Page Design */}
               <div className="w-full max-w-2xl rounded-2xl p-6 relative overflow-hidden"
                    style={{ 
                      backgroundColor: 'var(--card-bg)',
                      border: '2px solid var(--border-color)',
                      boxShadow: '0 20px 60px -15px rgba(139, 29, 29, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}>
                  {/* Wax seal decoration */}
                  <div className="flex flex-col items-center mb-4">
                     <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                          style={{ backgroundColor: 'rgba(139, 29, 29, 0.1)' }}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center shadow-lg">
                           <Send className="text-white w-4 h-4" />
                        </div>
                     </div>
                     <h3 className="text-xl font-serif italic text-center" style={{ color: 'var(--text-primary)' }}>
                        {formData.title || 'Untitled Capsule'}
                     </h3>
                     <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>A memory for {formData.recipientName || 'your future self'}</p>
                  </div>

                  {/* Letter Paper Preview */}
                  <div className="rounded-lg p-4 text-left relative overflow-hidden mb-4"
                       style={{ 
                         backgroundColor: '#fcf9f2',
                         border: '1px solid #e5e0d8',
                         color: '#3f3f46'
                       }}>
                     {/* Paper texture overlay */}
                     <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-color-burn" 
                          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
                     
                     <div className="relative z-10">
                        <p className="text-base leading-relaxed whitespace-pre-wrap font-serif">
                           {formData.content || 'Your message will appear here...'}
                        </p>
                     </div>
                  </div>

                  {/* Attached Media Preview */}
                  {formData.mediaUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-2">
                       {formData.mediaUrls.map((url, i) => (
                         <div key={i} className="p-1 bg-white shadow-lg rounded max-w-[80px] rotate-[-2deg]">
                            <img src={url} alt={`Memory ${i + 1}`} className="w-full h-auto object-cover rounded sepia-[0.1]" />
                         </div>
                       ))}
                    </div>
                  )}

                  {/* YouTube indicator */}
                  {formData.youtubeUrl && (
                    <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-600">
                       <Music className="w-3 h-3 animate-pulse" />
                       Atmospheric Track Attached
                    </div>
                  )}
               </div>
                <div className="flex items-center justify-center gap-3 mt-5">
                   <button
                     onClick={() => {
                       sessionStorage.setItem('capsule_preview', JSON.stringify({
                         title: formData.title,
                         recipientName: formData.recipientName,
                         content: formData.content,
                         youtubeUrl: formData.youtubeUrl,
                         mediaUrls: formData.mediaUrls,
                       }))
                       window.open('/preview', '_blank')
                     }}
                     className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all"
                     style={{
                       backgroundColor: 'var(--bg-secondary)',
                       color: 'var(--text-primary)',
                       border: '1px solid var(--border-color)',
                     }}
                   >
                     Preview in new tab
                   </button>
                </div>
             </motion.div>
           )}

           {step === 4 && (
             <motion.div
               key="step4"
               initial={{ opacity: 0, y: 15, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -10, scale: 0.95 }}
               transition={{ duration: 0.35, ease: 'easeOut' }}
               className="flex-1 flex flex-col items-center justify-center text-center py-6"
            >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ring-1 ring-red-500/30"
                     style={{ backgroundColor: 'var(--bg-secondary)' }}>
                   <Lock className="text-red-500 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif italic mb-2" style={{ color: 'var(--text-primary)' }}>Deliver to the Future</h3>

                <div className="max-w-xs space-y-3 mb-6">
                   <div>
                      <label className="block text-[10px] uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Recipient Email</label>
                      <input
                        type="email"
                        placeholder="their@email.com"
                        className="w-full rounded-lg px-3 py-2 outline-none"
                        style={{ 
                          backgroundColor: 'var(--input-bg)', 
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-primary)'
                        }}
                        value={formData.recipientEmail}
                        onChange={e => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] uppercase mb-1" style={{ color: 'var(--text-tertiary)' }}>Unlock Date</label>
                      <input
                        type="date"
                        className="w-full rounded-lg px-3 py-2 outline-none"
                        style={{ 
                          backgroundColor: 'var(--input-bg)', 
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-primary)'
                        }}
                        value={formData.deliveryDate}
                        onChange={e => setFormData(prev => ({ ...prev, deliveryDate: e.target.value }))}
                      />
                   </div>
                </div>

                <p className="text-xs max-w-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
                  Once sealed, the content of this letter will be encrypted and permanent.
                  You can only change the delivery date from your dashboard.
                </p>

                <button
                  onClick={handleSeal}
                  className="w-full max-w-sm bg-red-700 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Confirm & Seal Letter
                  <Send className="w-4 h-4" />
                </button>
             </motion.div>
          )}
        </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="pt-5 pb-5 px-6 flex items-center justify-between border-t flex-shrink-0"
             style={{ borderColor: 'var(--border-color)' }}>
           <motion.button
             onClick={() => setStep(s => Math.max(1, s - 1))}
             disabled={step === 1}
             whileHover={step > 1 ? { x: -3, scale: 1.02 } : {}}
             whileTap={step > 1 ? { scale: 0.97 } : {}}
             className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
             style={{ 
               color: step > 1 ? 'var(--text-primary)' : 'transparent',
               backgroundColor: step > 1 ? 'var(--bg-secondary)' : 'transparent',
             }}
           >
             <ChevronLeft className="w-4 h-4" />
             <span className="text-sm font-medium">Back</span>
           </motion.button>

           {step < 4 ? (
             <motion.button
               onClick={() => setStep(s => Math.min(4, s + 1))}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.97 }}
               className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
               style={{
                 background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                 color: 'white',
                 boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
               }}
             >
                Continue
                <ChevronRight className="w-4 h-4" />
             </motion.button>
           ) : (
             <div />
           )}
        </div>
      </div>
    </div>

      {/* Ghost Writer Modal */}
      <GhostWriterModal
        isOpen={ghostWriterOpen}
        onClose={() => setGhostWriterOpen(false)}
        onGenerate={(prompt, tone) => handleAIHelp(prompt, tone)}
        isLoading={isGenerating}
      />

      {/* Snackbar for errors and success messages */}
      <Snackbar
        message={snackbar.message}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
        type={snackbar.type}
        duration={5000}
      />

      {/* Sealing Animation Overlay */}
      <SealingAnimation isVisible={isSealing} />
    </div>
  )
}
