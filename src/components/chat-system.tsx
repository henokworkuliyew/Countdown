'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useSocket } from '@/hooks/use-socket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Users } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date | string
}

export default function ChatSystem() {
  const { data: session } = useSession()
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch('/api/chat/messages')
        const data = await response.json()
        setMessages(data.messages || [])
      } catch (error) {
        console.error('[v0] Error loading messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  useEffect(() => {
    if (!socket || !session) return

    socket.emit('join-chat', session.user.id)

    socket.on('new-message', (message: Message) => {
      console.log('[v0] Received new message:', message.id)
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socket.off('new-message')
    }
  }, [socket, session])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !socket) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: {
        id: session.user.id,
        name: session.user.name || 'Anonymous',
        avatar: session.user.image || '',
      },
      timestamp: new Date(),
    }

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      })

      if (response.ok) {
        socket.emit('send-message', message)
        setNewMessage('')
      }
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="h-[500px] bg-white rounded-lg shadow-md flex items-center justify-center">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[500px] flex flex-col">
      <div className="p-4 border-b bg-blue-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Class Chat
          </h3>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={message.sender.avatar || '/placeholder.svg'}
                />
                <AvatarFallback>
                  {message.sender.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-900">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
