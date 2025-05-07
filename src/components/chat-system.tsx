"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Smile, Paperclip, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  timestamp: Date
}

interface User {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  lastSeen?: Date
}

// Sample data
const currentUser: User = {
  id: "user1",
  name: "You",
  avatar: "/placeholder.svg?height=40&width=40",
  status: "online",
}

const users: User[] = [
  {
    id: "user2",
    name: "Abebe Kebede",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "user3",
    name: "Tigist Haile",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "user4",
    name: "Dawit Mekonnen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "user5",
    name: "Sara Tekle",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
]

const initialMessages: Message[] = [
  {
    id: "msg1",
    content: "Hey everyone! How's the graduation preparation going?",
    sender: users[0],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "msg2",
    content: "I'm so excited! Just got my graduation gown yesterday.",
    sender: users[1],
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: "msg3",
    content: "Has anyone heard about the after-party location?",
    sender: currentUser,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "msg4",
    content: "I think it's at the Blue Nile Hotel, but let me confirm with the committee.",
    sender: users[2],
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
  },
]

export default function ChatSystem() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: `msg${Date.now()}`,
      content: newMessage,
      sender: currentUser,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastSeen = (date?: Date) => {
    if (!date) return "Unknown"

    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hr ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-md">
      <Tabs defaultValue="chat" onValueChange={setActiveTab} value={activeTab}>
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b px-4">
            <TabsTrigger
              value="chat"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="people"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none"
            >
              People
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="p-0 m-0">
          <div className="flex flex-col h-[500px]">
            <ScrollArea className="flex-1 p-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.sender.id === currentUser.id ? "justify-end" : "justify-start"}`}
                >
                  {message.sender.id !== currentUser.id && (
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    {message.sender.id !== currentUser.id && (
                      <div className="text-xs text-gray-500 mb-1">{message.sender.name}</div>
                    )}
                    <div
                      className={`rounded-lg px-3 py-2 max-w-xs md:max-w-md break-words ${
                        message.sender.id === currentUser.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</div>
                  </div>
                  {message.sender.id === currentUser.id && (
                    <Avatar className="h-8 w-8 ml-2">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Smile className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={newMessage.trim() === ""}
                  size="icon"
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="people" className="p-0 m-0">
          <div className="h-[500px]">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">ONLINE</h3>
                {users
                  .filter((user) => user.status === "online")
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">Online</div>
                      </div>
                    </div>
                  ))}

                <h3 className="text-sm font-medium text-gray-500 mt-6 mb-2">OFFLINE</h3>
                {users
                  .filter((user) => user.status === "offline")
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-300 border-2 border-white"></span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">Last seen {formatLastSeen(user.lastSeen)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
