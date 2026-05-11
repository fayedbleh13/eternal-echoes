import * as React from 'react'
import QRCodeRaw from 'react-qr-code'
const QRCode = (QRCodeRaw as any).default || QRCodeRaw;
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Download, Link as LinkIcon } from 'lucide-react'

interface QRModalProps {
  isOpen: boolean
  onClose: () => void
  shareToken: string
  title: string
}

export function QRModal({ isOpen, onClose, shareToken, title }: QRModalProps) {
  const shareUrl = `${window.location.origin}/unlock/${shareToken}`
  const [copied, setCopied] = React.useState(false)
  const [isDownloading, setIsDownloading] = React.useState(false)

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
  }

  const handleMouseLeave = () => {
    if (copied) {
      setCopied(false)
    }
  }

  const downloadQR = async () => {
    setIsDownloading(true)
    try {
      // Find the SVG element
      const svg = document.querySelector('#qr-code-modal svg') as SVGElement
      if (!svg) {
        console.error('QR code SVG not found')
        return
      }

      // Create a canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set canvas size (add padding for white background)
      const size = 300
      canvas.width = size
      canvas.height = size

      // Fill white background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, size, size)

      // Convert SVG to string
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      // Create image from SVG
      const img = new Image()
      img.onload = () => {
        // Draw centered with padding
        ctx.drawImage(img, 25, 25, 250, 250)
        URL.revokeObjectURL(url)

        // Download
        const pngUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr.png`
        link.href = pngUrl
        link.click()
        setIsDownloading(false)
      }
      img.src = url
    } catch (error) {
      console.error('Failed to download QR:', error)
      setIsDownloading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-md glass-card relative z-10 overflow-hidden"
            style={{ borderColor: 'rgba(139, 29, 29, 0.4)' }}
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-serif italic truncate pr-6" style={{ color: 'var(--text-primary)' }}>{title}</h3>
               <button onClick={onClose} 
                       className="transition-all p-1 rounded-lg hover:bg-red-50"
                       style={{ color: 'var(--text-tertiary)' }}
                       onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                       onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}>
                  <X className="w-6 h-6" />
               </button>
            </div>

            <div id="qr-code-modal" className="bg-white p-6 rounded-2xl mx-auto mb-8 shadow-2xl max-w-[200px]"
                 style={{ boxShadow: '0 25px 50px -12px rgba(139, 29, 29, 0.2)' }}>
               <QRCode value={shareUrl} size={150} />
            </div>

            <p className="text-center text-sm mb-8 px-4" style={{ color: 'var(--text-secondary)' }}>
              Recipients can scan this QR code or use the magic link to access this capsule once it reaches its destination.
            </p>

            <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={copyLink}
                 onMouseLeave={handleMouseLeave}
                 disabled={copied}
                 className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium hover:bg-zinc-100"
                 style={{ 
                   backgroundColor: copied ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                   color: copied ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                   border: '1px solid var(--border-color)',
                   cursor: copied ? 'default' : 'pointer'
                 }}
               >
                  {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy Link'}
               </button>
               <button 
                 onClick={downloadQR}
                 disabled={isDownloading}
                 className="flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-white hover:bg-red-800 disabled:opacity-70"
                 style={{ 
                   backgroundColor: '#8B1D1D',
                   boxShadow: '0 4px 14px rgba(139, 29, 29, 0.4)'
                 }}
               >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? 'Saving...' : 'Download'}
               </button>
            </div>

            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-950/20 blur-3xl rounded-full" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
