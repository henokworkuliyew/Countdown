import type { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Store active connections
const connections = new Map<string, ReadableStreamDefaultController>()

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 })
  }

  const stream = new ReadableStream({
    start(controller) {
      // Store connection for this user
      connections.set(session.user.id, controller)

      // Send initial connection message
      controller.enqueue(
        `data: ${JSON.stringify({
          type: 'connected',
          userId: session.user.id,
        })}\n\n`
      )

      // Keep connection alive
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(`data: ${JSON.stringify({ type: 'ping' })}\n\n`)
        } catch (error) {
          clearInterval(keepAlive)
          connections.delete(session.user.id)
        }
      }, 30000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(keepAlive)
        connections.delete(session.user.id)
        try {
          controller.close()
        } catch (error) {
          // Connection already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

// Broadcast message to all connected users
export function broadcastMessage(message: any) {
  const data = `data: ${JSON.stringify(message)}\n\n`

  for (const [userId, controller] of connections.entries()) {
    try {
      controller.enqueue(data)
    } catch (error) {
      // Remove dead connection
      connections.delete(userId)
    }
  }
}


export function getOnlineUsers() {
  return Array.from(connections.keys())
}
