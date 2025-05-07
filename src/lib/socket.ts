import type { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import type { NextApiRequest } from 'next'
import type { NextApiResponse } from 'next'

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initializeSocket = (
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) => {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.io server...')
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`)

      socket.on('join-room', (roomId: string) => {
        console.log(`Socket ${socket.id} joining room: ${roomId}`)
        socket.join(roomId)
      })

      socket.on('leave-room', (roomId: string) => {
        console.log(`Socket ${socket.id} leaving room: ${roomId}`)
        socket.leave(roomId)
      })

      socket.on('send-message', (data: { roomId: string; message: any }) => {
        console.log(`New message in room ${data.roomId}:`, data.message)
        io.to(data.roomId).emit('new-message', data.message)
      })

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`)
      })
    })
  }

  return res.socket.server.io
}
