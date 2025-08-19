import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import {
  generateUploadDropzone,
  generateUploadButton,
} from '@uploadthing/react'

const f = createUploadthing({
  errorFormatter: (err) => {
    console.log('Upload error:', err.message)
    return { message: err.message }
  },
})

const auth = (req: Request) => {
  // For demo purposes, always return a user
  // In production, implement proper authentication
  return { id: 'demo-user-id' }
}

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      console.log('[v0] Middleware called')
      const user = await auth(req)

      if (!user) {
        console.log('[v0] No user found')
        throw new UploadThingError('Unauthorized')
      }

      console.log('[v0] User authenticated:', user.id)
      return { userId: user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('[v0] Upload complete for userId:', metadata.userId)
      console.log('[v0] File details:', {
        name: file.name,
        size: file.size,
        url: file.url,
        key: file.key,
      })

      const fileUrl = file.url || `https://utfs.io/f/${file.key}`
      console.log('[v0] Returning URL:', fileUrl)

      return {
        uploadedBy: metadata.userId,
        url: fileUrl,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
export const UploadButton = generateUploadButton<OurFileRouter>()
