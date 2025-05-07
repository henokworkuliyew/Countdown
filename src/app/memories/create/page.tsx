'use client'

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
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { UploadDropzone } from '@/lib/uploadthing'

const memorySchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(1000),
  imageUrl: z.string().min(1, { message: 'Please upload an image' }),
})

type MemoryFormValues = z.infer<typeof memorySchema>

export default function CreateMemoryPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
    },
  })

  async function onSubmit(data: MemoryFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      // Create memory with the uploaded image URL
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Failed to create memory. Please try again.')
        return
      }

      // Show success toast
      toast({
        title: 'Memory created',
        description: 'Your memory has been shared successfully!',
      })

      // Redirect to the memory page
      router.push(`/memories/${result.memory._id}`)
      router.refresh()
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Create memory error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Share a Memory</CardTitle>
            <CardDescription>
              Share your favorite moments from your time at Bahirdar University
              Computer Science Department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
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
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a title for your memory"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Give your memory a meaningful title.
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your memory..."
                          className="min-h-32"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Share the story behind this memory.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <UploadDropzone
                          className="p-2 border border-gray-600"
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            // Update form with uploaded image URL
                            form.setValue('imageUrl', res[0].url)
                          }}
                          onUploadError={(error) => {
                            console.log('Error uploading image:', error)
                            toast({
                              title: 'Upload Error',
                              description:
                                'Failed to upload image. Please try again.',
                              variant: 'destructive',
                            })
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an image for your memory.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating memory...
                    </>
                  ) : (
                    'Share Memory'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
