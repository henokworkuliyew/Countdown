"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, Users, Paperclip, Smile, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  timestamp: Date
  type: "text" | "image" | "system"
}

interface ChatSystemProps {
  className?: string
}

export default function ChatSystem({ className }: ChatSystemProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hey everyone! How's the graduation preparation going? 🎓",
      author: { id: "1", name: "Tigist Haile", image: "/placeholder.svg" },
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
    },
    {
      id: "2",
      content: "I'm so excited! Can't believe it's almost here 😊",
      author: { id: "2", name: "Dawit Mekonnen", image: "/placeholder.svg" },
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
    },
    {
      id: "3",
      content: "Anyone else nervous about the ceremony?",
      author: { id: "3", name: "Sara Tekle", image: "/placeholder.svg" },
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      type: "text",
    },
    {
      id: "4",
      content: "We've got this! We've been through 4 years together 💪",
      author: { id: "4", name: "Abebe Kebede", image: "/placeholder.svg" },
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "text",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      author: { id: "current-user", name: "You", image: "/placeholder.svg" },
      timestamp: new Date(),
      type: "text",
    }

    setMessages([...messages, message])
    setNewMessage("")
    setIsTyping(true)

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(false)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for sharing! This is going to be an amazing graduation ceremony! 🎉",
        author: { id: "bot", name: "Class Bot", image: "/placeholder.svg" },
        timestamp: new Date(),
        type: "text",
      }
      setMessages(prev => [...prev, botMessage])
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return "Today"
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {/* Chat Header */}
      <motion.div
        className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Class Chat</h2>
              <p className="text-blue-100 text-sm">Stay connected with your classmates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${i}`} />
                  <AvatarFallback className="bg-blue-400 text-white text-xs">
                    {i}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-6 bg-gray-50">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`mb-4 flex ${message.author.id === "current-user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-xs lg:max-w-md ${message.author.id === "current-user" ? "flex-row-reverse" : ""}`}>
                {message.author.id !== "current-user" && (
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.author.image} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
                      {message.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col ${message.author.id === "current-user" ? "items-end" : "items-start"}`}>
                  {message.author.id !== "current-user" && (
                    <span className="text-xs text-gray-500 mb-1">{message.author.name}</span>
                  )}
                  
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.author.id === "current-user"
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    } shadow-sm`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  
                  <span className="text-xs text-gray-400 mt-1">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start mb-4"
          >
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white text-xs">
                  B
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Class Bot</span>
                <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <motion.div
        className="p-4 bg-white border-t border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <Smile className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </motion.div>
    </div>
  )
}
