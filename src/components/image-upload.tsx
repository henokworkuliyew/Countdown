'use client'

import type React from 'react'
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/lib/uploadthing'

interface ImageUploadProps {
  onChange: (url: string) => void
  value: string
  endpoint: 'memoryImage' | 'profileImage'
  className?: string
}

export default function ImageUpload({
  onChange,
  value,
  endpoint,
  className = '',
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(value || null)
  const { toast } = useToast()
  const { startUpload, isUploading } = useUploadThing(endpoint)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0]

        if (!file) {
          throw new Error('No file selected')
        }

        // Debug: Log file details
        console.log('Uploading file:', file.name, file.size, file.type)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload using uploadthing
        const uploadResult = await startUpload([file])

        // Debug: Log upload result
        console.log('Upload result:', uploadResult)

        if (!uploadResult || uploadResult.length === 0) {
          throw new Error('Upload failed')
        }

        // Get the URL from the result
        const imageUrl = uploadResult[0].url

        // Call the onChange function with the URL
        onChange(imageUrl)

        toast({
          title: 'Upload successful',
          description: 'Your image has been uploaded successfully',
        })
      } catch (error) {
        console.error('Upload error:', error)
        toast({
          title: 'Upload failed',
          description:
            error instanceof Error
              ? error.message
              : 'Something went wrong during upload',
          variant: 'destructive',
        })
        // Reset preview if upload failed
        if (!value) {
          setImagePreview(null)
        } else {
          setImagePreview(value)
        }
      }
    },
    [onChange, startUpload, toast, value]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImagePreview(null)
    onChange('')
  }

  return (
    <div
      {...getRootProps()}
      className={`relative cursor-pointer border-2 border-dashed rounded-lg transition-all ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:bg-gray-50'
      } ${className}`}
    >
      <input {...getInputProps()} />

      {imagePreview ? (
        <div className="relative h-full w-full">
          <img
            src={imagePreview || '/placeholder.svg'}
            alt="Uploaded"
            className="h-full w-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            {!isUploading && (
              <>
                <p className="text-white font-medium">
                  Click or drop to change image
                </p>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                {isDragActive
                  ? 'Drop the image here'
                  : 'Drag & drop an image here'}
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to browse</p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, JPEG, GIF up to 16MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
