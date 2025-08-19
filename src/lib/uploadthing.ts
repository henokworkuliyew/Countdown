import { OurFileRouter } from '@/lib/core'
import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react'

export const UploadButton = generateUploadButton<OurFileRouter>()
export const UploadDropzone = generateUploadDropzone<OurFileRouter>()
