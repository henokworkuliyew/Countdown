import type { NextRequest } from 'next/server'
import { Server as SocketIOServer } from 'socket.io'
import { createServer } from 'http'

let io: SocketIOServer | undefined

function initializeSocketIO() {
  if (!io) {
    // Create HTTP server for socket.io
    const httpServer = createServer()

    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    })

    io.on('connection', (socket) => {
      console.log('[v0] Socket connected:', socket.id)

      socket.on('join-chat', (userId: string) => {
        socket.join('chat-room')
        console.log('[v0] User joined chat:', userId)
      })

      socket.on('send-message', async (data) => {
        console.log('[v0] Message received:', data)
        io?.to('chat-room').emit('new-message', data)
      })

      socket.on('disconnect', () => {
        console.log('[v0] Socket disconnected:', socket.id)
      })
    })

    // Start the HTTP server on a different port for socket.io
    const port = process.env.SOCKET_PORT || 3001
    httpServer.listen(port, () => {
      console.log(`[v0] Socket.IO server running on port ${port}`)
    })
  }

  return io
}

export async function GET(req: NextRequest) {
  const socketServer = initializeSocketIO()
  return new Response('Socket.IO server initialized', { status: 200 })
}

export { io }
