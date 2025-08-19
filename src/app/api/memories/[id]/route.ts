import { type NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Memory } from '@/models/memory'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('[v0] Fetching memory:', id)

    await connectToDatabase()

    const memory: any = await Memory.findById(id)
      .populate('author', 'name image')
      .lean()

    if (!memory) {
      return NextResponse.json({ message: 'Memory not found' }, { status: 404 })
    }

    // Transform the memory data for safe JSON serialization
    const transformedMemory = {
      _id: memory._id.toString(),
      title: memory.title,
      description: memory.description,
      imageUrl: memory.imageUrl,
      createdAt: memory.createdAt,
      author: {
        id: memory.author._id.toString(),
        name: memory.author.name,
        image: memory.author.image || null,
      },
      likes: memory.likes || 0,
      comments: memory.comments || [],
    }

    return NextResponse.json(transformedMemory)
  } catch (error) {
    console.error('[v0] Get memory error:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching the memory' },
      { status: 500 }
    )
  }
}
