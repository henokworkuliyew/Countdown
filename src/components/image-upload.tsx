'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, X, ImageIcon, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onImageUpload: (file: File) => void
  onImageRemove?: () => void
  currentImage?: string
  className?: string
  maxSize?: number // in MB
  acceptedTypes?: string[]
}

export default function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImage,
  className = '',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}: ImageUploadProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '')
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError('')

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${maxSize}MB.`)
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError(
            'Invalid file type. Please upload an image (JPEG, PNG, or WebP).'
          )
        } else {
          setError('Error uploading file. Please try again.')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          setError(`File is too large. Maximum size is ${maxSize}MB.`)
          return
        }

        // Validate file type
        if (!acceptedTypes.includes(file.type)) {
          setError(
            'Invalid file type. Please upload an image (JPEG, PNG, or WebP).'
          )
          return
        }

        setUploadedImage(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        onImageUpload(file)
      }
    },
    [maxSize, acceptedTypes, onImageUpload]
  )

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes,
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  })

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setPreviewUrl('')
    setError('')
    if (onImageRemove) {
      onImageRemove()
    }
  }

  const containerVariants = {
    idle: { scale: 1, borderColor: '#e5e7eb' },
    dragActive: { scale: 1.02, borderColor: '#3b82f6' },
    dragReject: { scale: 0.98, borderColor: '#ef4444' },
  }

  const {
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    onDrop: dropzoneOnDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
    tabIndex,
    role,
    ...otherRootProps
  } = getRootProps()

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <motion.div
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        tabIndex={tabIndex}
        role={role}
        variants={containerVariants}
        animate={
          isDragReject ? 'dragReject' : isDragActive ? 'dragActive' : 'idle'
        }
        transition={{ duration: 0.2 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : isDragReject
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
          }
        `}
        style={{ pointerEvents: 'auto' }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={previewUrl || '/placeholder.svg'}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />

              {/* Remove Button */}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Success Indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="absolute -bottom-2 -left-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-blue-600" />
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload an image'}
              </h3>

              <p className="text-gray-500 mb-4">
                Drag and drop your image here, or click to browse
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>JPEG, PNG, WebP</span>
                <span>•</span>
                <span>Max {maxSize}MB</span>
              </div>

              <Button
                variant="outline"
                className="mt-4 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                onClick={(e) => e.stopPropagation()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag Overlay */}
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-blue-500/10 rounded-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-xl font-bold text-blue-700">
                Drop your image here
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress (Optional) */}
      {uploadedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-green-700 font-medium">
                Image uploaded successfully!
              </p>
              <p className="text-green-600 text-sm">
                {uploadedImage.name} (
                {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Supported formats: JPEG, PNG, WebP • Maximum size: {maxSize}MB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          For best results, use high-quality images with good lighting
        </p>
      </div>
    </div>
  )
}
