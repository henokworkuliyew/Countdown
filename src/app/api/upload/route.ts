import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ message: 'No file provided' }, { status: 400 })
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File must be an image' },
        { status: 400 }
      )
    }

    // Check file size (max 16MB)
    if (file.size > 16 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File size must be less than 16MB' },
        { status: 400 }
      )
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']

    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { message: 'Invalid file type' },
        { status: 400 }
      )
    }

    // Create a unique filename
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    const publicDir = join(process.cwd(), 'public')
    const uploadsDir = join(publicDir, 'uploads')

    // Ensure uploads directory exists
    try {
      await writeFile(join(uploadsDir, '.keep'), '')
    } catch (error) {
      console.error('Error ensuring uploads directory exists:', error)
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write file to public/uploads directory
    const filePath = join(uploadsDir, uniqueFilename)
    await writeFile(filePath, buffer)

    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${uniqueFilename}`

    return NextResponse.json({ url: fileUrl }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { message: 'Error uploading file' },
      { status: 500 }
    )
  }
}
