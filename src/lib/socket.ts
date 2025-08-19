import type { Server as NetServer } from 'http'
import type { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import type { NextApiResponseServerIO } from '@/types/socket'

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('[v0] Socket is already running')
  } else {
    console.log('[v0] Socket is initializing')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('[v0] User connected:', socket.id)

      socket.on('join-chat', (userId) => {
        socket.join('chat-room')
        console.log('[v0] User joined chat room:', userId)
      })

      socket.on('send-message', (message) => {
        console.log('[v0] Broadcasting message:', message.id)
        io.to('chat-room').emit('new-message', message)
      })

      socket.on('disconnect', () => {
        console.log('[v0] User disconnected:', socket.id)
      })
    })
  }
  res.end()
}

export default SocketHandler
