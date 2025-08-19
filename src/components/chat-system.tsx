'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useChatStream } from '@/hooks/use-chat-stream'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Users, Circle } from 'lucide-react'

interface Message {
  _id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
}

export default function ChatSystem() {
  const { data: session } = useSession()
  const { messages, isConnected, onlineUsers, sendMessage } = useChatStream()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !session) return

    try {
      await sendMessage(newMessage.trim())
      setNewMessage('')
    } catch (error) {
      console.error('[v0] Error sending message:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md h-[600px] flex">
      <div className="w-64 border-r bg-gray-50 rounded-l-lg">
        <div className="p-4 border-b">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Online ({onlineUsers.length})
          </h4>
        </div>
        <ScrollArea className="h-[calc(600px-73px)]">
          <div className="p-2 space-y-2">
            {onlineUsers.length > 0 ? (
              onlineUsers.map((userId) => (
                <div
                  key={userId}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-700 truncate">
                    User {userId.slice(-4)}
                  </span>
                  <Circle className="w-2 h-2 fill-green-500 text-green-500 ml-auto" />
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-500 text-center">
                No users online
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Class Chat</h3>
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
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message._id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={message.author.image || '/placeholder.svg'}
                    />
                    <AvatarFallback>
                      {message.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {message.author.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
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
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
