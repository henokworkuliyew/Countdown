'use client'

import { useEffect, useState } from 'react'

interface ChatMessage {
  _id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
}

export const useChatStream = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    // Fetch initial messages
    fetch('/api/chat/messages')
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch(console.error)

    // Connect to SSE stream
    const eventSource = new EventSource('/api/chat/stream')

    eventSource.onopen = () => {
      console.log('[v0] Chat stream connected')
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'new_message') {
          setMessages((prev) => [...prev, data.message])
        } else if (data.type === 'connected') {
          console.log('[v0] User connected:', data.userId)
        } else if (data.type === 'user_joined') {
          setOnlineUsers((prev) => [...prev, data.userId])
        } else if (data.type === 'user_left') {
          setOnlineUsers((prev) => prev.filter((id) => id !== data.userId))
        }
      } catch (error) {
        console.error('[v0] Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = () => {
      console.log('[v0] Chat stream disconnected')
      setIsConnected(false)
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const sendMessage = async (content: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    }
  }

  return {
    messages,
    isConnected,
    onlineUsers,
    sendMessage,
  }
}
