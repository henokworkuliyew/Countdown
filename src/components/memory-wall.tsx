"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface Memory {
  id: number
  title: string
  description: string
  image: string
  date: string
  likes: number
  comments: number
  author: {
    name: string
    avatar: string
  }
}

const memories: Memory[] = [
  {
    id: 1,
    title: "First Day at BDU",
    description:
      "Remember our first day at the Computer Science department? So many new faces and exciting possibilities ahead!",
    image: "/placeholder.svg?height=300&width=400",
    date: "September 5, 2021",
    likes: 42,
    comments: 8,
    author: {
      name: "Abebe Kebede",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    title: "Programming Competition",
    description:
      "Our team won the inter-university programming competition! Those sleepless nights practicing algorithms paid off.",
    image: "/placeholder.svg?height=300&width=400",
    date: "March 15, 2023",
    likes: 38,
    comments: 12,
    author: {
      name: "Tigist Haile",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    title: "CS Department Picnic",
    description:
      "The annual department picnic at Lake Tana was amazing! Great food, games, and conversations with professors.",
    image: "/placeholder.svg?height=300&width=400",
    date: "May 20, 2024",
    likes: 56,
    comments: 15,
    author: {
      name: "Dawit Mekonnen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    title: "Final Project Presentation",
    description:
      "Presenting our final year project to the faculty and industry representatives. So proud of what we accomplished!",
    image: "/placeholder.svg?height=300&width=400",
    date: "June 10, 2025",
    likes: 64,
    comments: 23,
    author: {
      name: "Sara Tekle",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function MemoryWall() {
  const [likedMemories, setLikedMemories] = useState<number[]>([])

  const handleLike = (id: number) => {
    if (likedMemories.includes(id)) {
      setLikedMemories(likedMemories.filter((memoryId) => memoryId !== id))
    } else {
      setLikedMemories([...likedMemories, id])
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {memories.map((memory, index) => (
        <motion.div
          key={memory.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <Card className="overflow-hidden h-full">
            <CardHeader className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img
                    src={memory.author.avatar || "/placeholder.svg"}
                    alt={memory.author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{memory.author.name}</h3>
                  <p className="text-sm text-gray-500">{memory.date}</p>
                </div>
              </div>
            </CardHeader>
            <div className="relative h-48 md:h-64 overflow-hidden">
              <img
                src={memory.image || "/placeholder.svg"}
                alt={memory.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{memory.title}</h3>
              <p className="text-gray-700">{memory.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${likedMemories.includes(memory.id) ? "text-red-500" : ""}`}
                onClick={() => handleLike(memory.id)}
              >
                <Heart className="h-4 w-4" />
                <span>{memory.likes + (likedMemories.includes(memory.id) ? 1 : 0)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{memory.comments}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
