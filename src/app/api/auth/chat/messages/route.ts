import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ChatMessage } from '@/models/chat-message'
import { z } from 'zod'
import { broadcastMessage } from '../stream/route'

const messageSchema = z.object({
  content: z.string().min(1),
})

export async function GET() {
  try {
    console.log('[v0] GET /api/chat/messages - Starting request')
    await connectToDatabase()
    console.log('[v0] Database connected successfully')

    // Get the most recent 50 messages with author populated
    const messages = await ChatMessage.find()
      .populate('author', 'name image')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    console.log('[v0] Found', messages.length, 'messages')

    const transformedMessages = messages.reverse().map((msg: any) => ({
      _id: msg._id.toString(),
      content: msg.content,
      author: {
        id: msg.author._id?.toString() || msg.author,
        name: msg.author.name || 'Anonymous',
        image: msg.author.image || '',
      },
      createdAt: msg.createdAt,
    }))

    return NextResponse.json(transformedMessages)
  } catch (error) {
    console.error('[v0] Error fetching chat messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    console.log('[v0] POST /api/chat/messages - Starting request')
    const session = await getServerSession(authOptions)
    console.log('[v0] Session:', session ? 'exists' : 'null')

    if (!session) {
      console.log('[v0] No session found, returning 401')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId =
      session.user?.id || session.user || (session.user as any)?.userId
    console.log('[v0] User ID:', userId)

    if (!userId) {
      console.log('[v0] No user ID found in session')
      return NextResponse.json(
        { message: 'User ID not found in session' },
        { status: 401 }
      )
    }

    const body = await req.json()
    console.log('[v0] Request body:', body)

    // Validate input
    const result = messageSchema.safeParse(body)
    if (!result.success) {
      console.log('[v0] Validation failed:', result.error.errors)
      return NextResponse.json(
        { message: 'Invalid message format', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { content } = result.data

    await connectToDatabase()
    console.log('[v0] Database connected, saving message')

    const newMessage = await ChatMessage.create({
      content,
      author: userId,
      createdAt: new Date(),
    })

    await newMessage.populate('author', 'name image')

    const messageForBroadcast = {
      _id: newMessage._id.toString(),
      content: newMessage.content,
      author: {
        id: newMessage.author._id?.toString() || newMessage.author,
        name: newMessage.author.name || 'Anonymous',
        image: newMessage.author.image || '',
      },
      createdAt: newMessage.createdAt,
    }

    broadcastMessage({
      type: 'new_message',
      message: messageForBroadcast,
    })

    console.log('[v0] Message saved and broadcasted successfully')
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error saving chat message:', error)
    return NextResponse.json(
      { message: 'Failed to save message' },
      { status: 500 }
    )
  }
}
