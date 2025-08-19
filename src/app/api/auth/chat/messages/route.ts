import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import { ChatMessage } from '@/models/chat-message'
import { z } from 'zod'

const messageSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  sender: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string().optional(),
  }),
  timestamp: z.date().or(z.string().transform((str) => new Date(str))),
})

export async function GET() {
  try {
    console.log('[v0] GET /api/chat/messages - Starting request')
    await connectToDatabase()
    console.log('[v0] Database connected successfully')

    // Get the most recent 50 messages
    const messages = await ChatMessage.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean()
    console.log('[v0] Found', messages.length, 'messages')

    // Transform messages to match frontend interface
    const transformedMessages = messages.reverse().map((msg: any) => ({
      id: msg.messageId || msg._id.toString(),
      content: msg.content,
      sender: {
        id: msg.sender.userId,
        name: msg.sender.name,
        avatar: msg.sender.avatar || '',
      },
      timestamp: msg.timestamp,
    }))

    return NextResponse.json({ messages: transformedMessages })
  } catch (error) {
    console.error('[v0] Error fetching chat messages:', error)
    return NextResponse.json(
      {
        messages: [],
        error: 'Failed to fetch messages',
      },
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

    const { id, content, sender, timestamp } = result.data

    if (sender.id !== userId) {
      console.log('[v0] Sender ID mismatch:', sender.id, 'vs', userId)
      return NextResponse.json(
        { message: 'Sender ID does not match authenticated user' },
        { status: 403 }
      )
    }

    await connectToDatabase()
    console.log('[v0] Database connected, saving message')

    // Save message to database
    await ChatMessage.create({
      messageId: id,
      content,
      sender: {
        userId: sender.id,
        name: sender.name,
        avatar: sender.avatar || '',
      },
      timestamp,
    })

    console.log('[v0] Message saved successfully')
    return NextResponse.json(
      { message: 'Message saved successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error saving chat message:', error)
    return NextResponse.json(
      {
        message: 'Failed to save message',
      },
      { status: 500 }
    )
  }
}
