import { type NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectToDatabase } from '@/lib/mongodb'
import { Memory } from '@/models/memory'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'

const commentSchema = z.object({
  content: z.string().min(1).max(500),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('[v0] Fetching comments for memory:', id)

    // Connect to database
    await connectToDatabase()

    const memory = (await Memory.findById(id)
      .populate({
        path: 'comments.author',
        select: 'name image',
        options: { lean: true },
      })
      .populate({
        path: 'comments.replies.author',
        select: 'name image',
        options: { lean: true },
      })
      .lean()) as any

    if (!memory) {
      return NextResponse.json({ message: 'Memory not found' }, { status: 404 })
    }

    console.log('[v0] Memory found, transforming comments')

    const transformedComments = (memory.comments || []).map((comment: any) => {
      const transformedReplies = (comment.replies || []).map((reply: any) => ({
        id: reply._id?.toString() || '',
        content: reply.content || '',
        author: {
          id: reply.author?._id?.toString() || '',
          name: reply.author?.name || 'Unknown',
          image: reply.author?.image || null,
        },
        createdAt: reply.createdAt,
        likes: reply.likes || 0,
        isLiked: false,
      }))

      return {
        id: comment._id?.toString() || '',
        content: comment.content || '',
        author: {
          id: comment.author?._id?.toString() || '',
          name: comment.author?.name || 'Unknown',
          image: comment.author?.image || null,
        },
        createdAt: comment.createdAt,
        likes: comment.likes || 0,
        replies: transformedReplies,
        isLiked: false,
      }
    })

    console.log('[v0] Comments transformed successfully')
    return NextResponse.json(transformedComments)
  } catch (error) {
    console.error('[v0] Get comments error:', error)
    return NextResponse.json(
      { message: 'An error occurred while fetching comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Authenticate user
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await req.json()
    const result = commentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid input', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { content } = result.data

    // Connect to database
    await connectToDatabase()

    // Find memory
    const memory = await Memory.findById(id)
    if (!memory) {
      return NextResponse.json({ message: 'Memory not found' }, { status: 404 })
    }

    // Add comment
    const comment = {
      content,
      author: session.user.id,
      createdAt: new Date(),
      likes: 0,
      replies: [],
    }

    memory.comments.push(comment)
    await memory.save()

    const populatedMemory = (await Memory.findById(id)
      .populate({
        path: 'comments.author',
        select: 'name image',
        options: { lean: true },
      })
      .lean()) as any

    if (!populatedMemory) {
      return NextResponse.json(
        { message: 'Failed to retrieve updated memory' },
        { status: 500 }
      )
    }

    const newComment =
      populatedMemory.comments?.[populatedMemory.comments.length - 1]

    if (!newComment) {
      return NextResponse.json(
        { message: 'Failed to retrieve new comment' },
        { status: 500 }
      )
    }

    const transformedComment = {
      id: newComment._id?.toString() || '',
      content: newComment.content || '',
      author: {
        id: newComment.author?._id?.toString() || '',
        name: newComment.author?.name || 'Unknown',
        image: newComment.author?.image || null,
      },
      createdAt: newComment.createdAt,
      likes: newComment.likes || 0,
      replies: [],
      isLiked: false,
    }

    return NextResponse.json(transformedComment, { status: 201 })
  } catch (error) {
    console.error('[v0] Add comment error:', error)
    return NextResponse.json(
      { message: 'An error occurred while adding the comment' },
      { status: 500 }
    )
  }
}
