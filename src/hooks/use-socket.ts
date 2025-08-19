'use client'

import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketPort = process.env.NEXT_PUBLIC_SOCKET_PORT || '3001'
    const socketUrl =
      process.env.NODE_ENV === 'production'
        ? `${window.location.protocol}//${window.location.hostname}:${socketPort}`
        : `http://localhost:${socketPort}`

    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
    })

    // Initialize the socket server
    fetch('/api/socket').catch(console.error)

    socketInstance.on('connect', () => {
      console.log('[v0] Socket connected to', socketUrl)
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('[v0] Socket disconnected')
      setIsConnected(false)
    })

    socketInstance.on('connect_error', (error) => {
      console.error('[v0] Socket connection error:', error)
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return { socket, isConnected }
}
