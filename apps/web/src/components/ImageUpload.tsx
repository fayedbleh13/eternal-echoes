import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  onError: (message: string) => void
  onSuccess?: (message: string) => void
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_IMAGES = 5

export function ImageUpload({ images, onImagesChange, onError, onSuccess }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum 5MB per image.`
    }
    return null
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Upload via GraphQL mutation
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation UploadMedia($base64: String!, $filename: String!) {
            uploadMedia(base64: $base64, filename: $filename) {
              url
            }
          }
        `,
        variables: {
          base64,
          filename: file.name
        }
      })
    })

    const data = await response.json()
    if (data.errors) {
      throw new Error(data.errors[0]?.message || 'Upload failed')
    }
    return data.data.uploadMedia.url
  }

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    // Check max images limit
    if (images.length + files.length > MAX_IMAGES) {
      onError(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - images.length} more.`)
      return
    }

    setUploading(true)
    const newImages: string[] = []

    for (const file of Array.from(files)) {
      const error = validateFile(file)
      if (error) {
        onError(error)
        continue
      }

      try {
        const url = await uploadToCloudinary(file)
        newImages.push(url)
      } catch (err) {
        onError(`Failed to upload ${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages])
      onSuccess?.(`Successfully uploaded ${newImages.length} image${newImages.length > 1 ? 's' : ''}`)
    }

    setUploading(false)
  }, [images, onImagesChange, onError, onSuccess])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <motion.div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? '#dc2626' : 'var(--input-border)',
          backgroundColor: isDragging ? 'rgba(220, 38, 38, 0.05)' : 'transparent'
        }}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all"
        style={{ borderColor: isDragging ? '#dc2626' : 'var(--input-border)' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Uploading images...</p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-red-100 dark:bg-red-950/30' : 'bg-zinc-100 dark:bg-zinc-800'
              }`}>
                {isDragging ? (
                  <Check className="w-6 h-6 text-red-600" />
                ) : (
                  <Upload className="w-6 h-6" style={{ color: 'var(--text-tertiary)' }} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {isDragging ? 'Drop images here' : 'Click or drag images here'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  JPEG, PNG, WebP, GIF up to 5MB
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                <ImageIcon className="w-3 h-3" />
                <span>{images.length} / {MAX_IMAGES} images</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image Previews */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-3 sm:grid-cols-5 gap-3"
          >
            {images.map((url, index) => (
              <motion.div
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
