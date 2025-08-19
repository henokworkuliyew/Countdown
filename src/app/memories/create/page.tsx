'use client'

import type React from 'react'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload, ImageIcon, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useUploadThing } from '@/lib/core'

const memorySchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(1000),
  imageUrl: z.string().optional(),
})

type MemoryFormValues = z.infer<typeof memorySchema>

export default function CreateMemoryPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const { toast } = useToast()

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (
      res: { url: string; key: string; name: string; size: number }[]
    ) => {
      console.log('[v0] Upload completed:', res)
      setUploadProgress('Upload completed successfully!')
    },
    onUploadError: (error: Error) => {
      console.error('[v0] Upload error:', error)
      setError(`Upload failed: ${error.message}`)
      setUploadProgress('')
    },
  })

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        setError('Image size must be less than 4MB')
        return
      }
      setSelectedFile(file)
      setError(null)
      console.log('[v0] File selected:', file.name, file.size)
    }
  }

  async function onSubmit(data: MemoryFormValues) {
    try {
      setIsLoading(true)
      setError(null)
      let imageUrl = ''

      // Upload image if file is selected
      if (selectedFile) {
        setUploadProgress('Uploading image...')
        console.log('[v0] Starting upload for file:', selectedFile.name)

        const uploadResult = await startUpload([selectedFile])

        if (uploadResult && uploadResult[0] && uploadResult[0].url) {
          imageUrl = uploadResult[0].url
          setUploadProgress('Image uploaded successfully!')
          console.log('[v0] Upload successful, URL:', imageUrl)
        } else {
          throw new Error('Upload failed - no URL returned')
        }
      } else {
        setError('Please select an image to upload')
        return
      }

      setUploadProgress('Creating memory...')
      console.log('[v0] Submitting memory with data:', { ...data, imageUrl })

      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Failed to create memory. Please try again.')
        return
      }

      toast({
        title: 'Memory created successfully!',
        description: `Your memory "${data.title}" has been shared with the community.`,
      })

      router.push(`/memories/${result.memory._id}`)
      router.refresh()
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Create memory error:', error)
      setUploadProgress('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Share a Memory
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Share your favorite moments from your time at Bahirdar University
              Computer Science Department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {uploadProgress && (
              <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription className="text-blue-700">
                  {uploadProgress}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a meaningful title for your memory"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormDescription>
                        Give your memory a title that captures the moment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell the story behind this memory... What made this moment special?"
                          className="min-h-32 text-base resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Share the story and emotions behind this memory.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    Image
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          disabled={isLoading}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {selectedFile ? (
                              <>
                                <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
                                <p className="text-sm text-green-600 font-medium">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{' '}
                                  MB
                                </p>
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to select
                                  </span>{' '}
                                  an image
                                </p>
                                <p className="text-xs text-gray-400">
                                  PNG, JPG, GIF up to 4MB
                                </p>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Select an image that represents your memory. It will be
                    uploaded when you share.
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  disabled={isLoading || !selectedFile}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {uploadProgress || 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      Share Memory
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="px-6"
            >
              Cancel
            </Button>
            <p className="text-sm text-gray-500">
              Your memory will be visible to all CS students
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
