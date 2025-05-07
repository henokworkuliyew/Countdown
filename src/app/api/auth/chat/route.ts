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
    await connectToDatabase()

    // Get the most recent 50 messages
    const messages = await ChatMessage.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .lean()

    // Return messages in chronological order
    return NextResponse.json({ messages: messages.reverse() })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json(
      { message: 'Error fetching chat messages' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const result = messageSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { message: 'Invalid message format', errors: result.error.errors },
        { status: 400 }
      )
    }

    const { id, content, sender, timestamp } = result.data

    // Verify the sender ID matches the session user ID
    if (sender.id !== session.user.id) {
      return NextResponse.json(
        { message: 'Sender ID does not match authenticated user' },
        { status: 403 }
      )
    }

    await connectToDatabase()

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

    return NextResponse.json(
      { message: 'Message saved successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving chat message:', error)
    return NextResponse.json(
      { message: 'Error saving chat message' },
      { status: 500 }
    )
  }
}
