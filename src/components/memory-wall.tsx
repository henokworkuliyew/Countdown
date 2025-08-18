"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, Share2, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Memory {
  _id: string
  title: string
  description: string
  imageUrl: string
  author: {
    name: string
    image?: string
  }
  createdAt: string
  likes: number
  comments: any[]
}

interface MemoryWallProps {
  memories: Memory[]
  showCreateButton?: boolean
}

export default function MemoryWall({ memories, showCreateButton = true }: MemoryWallProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (memories.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">No memories yet</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Be the first to share a memory from your time at Bahirdar University!
        </p>
        {showCreateButton && (
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
            <Link href="/memories/create">Share Your First Memory</Link>
          </Button>
        )}
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {showCreateButton && (
        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Memory Wall
            </h2>
            <p className="text-gray-600">
              Relive the moments that made our journey special
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            asChild
          >
            <Link href="/memories/create">Share Memory</Link>
          </Button>
        </motion.div>
      )}

      {/* Memories Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {memories.map((memory, index) => (
            <motion.div
              key={memory._id}
              variants={containerVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img
                    src={memory.imageUrl || '/placeholder.svg'}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Author Info */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {memory.author.name}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0 rounded-full bg-white/90 hover:bg-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <motion.h3
                    className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {memory.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-600 mb-4 line-clamp-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {memory.description}
                  </motion.p>

                  {/* Meta Information */}
                  <motion.div
                    className="flex items-center justify-between text-sm text-gray-500 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span>
                      {formatDistanceToNow(new Date(memory.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{memory.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{memory.comments.length}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                      asChild
                    >
                      <Link href={`/memories/${memory._id}`}>View Details</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                      asChild
                    >
                      <Link href={`/memories/edit/${memory._id}`}>Edit</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Load More Button */}
      {memories.length >= 9 && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Load More Memories
          </Button>
        </motion.div>
      )}
    </div>
  )
}
