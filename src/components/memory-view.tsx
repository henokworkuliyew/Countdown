'use client'

import type React from 'react'

import { useState, useEffect, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  ArrowLeft,
  Calendar,
  UserIcon,
  MessageCircle,
  Heart,
  Reply,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: Date | string
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface Memory {
  _id: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
}

interface MemoryViewProps {
  memoryId: string
  currentUser: any | null
}

const CommentItem = memo(
  ({
    comment,
    isReply = false,
    depth = 0,
    onLike,
    onReply,
    replyingTo,
    replyContent,
    setReplyContent,
    onSubmitReply,
    onKeyPress,
  }: {
    comment: Comment
    isReply?: boolean
    depth?: number
    onLike: (commentId: string) => void
    onReply: (commentId: string) => void
    replyingTo: string | null
    replyContent: string
    setReplyContent: (content: string) => void
    onSubmitReply: () => void
    onKeyPress: (e: React.KeyboardEvent, isReply?: boolean) => void
  }) => {
    const formatTime = useCallback((date: Date | string) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Unknown time'
      }

      const now = new Date()
      const diffInMinutes = Math.floor(
        (now.getTime() - dateObj.getTime()) / (1000 * 60)
      )

      if (diffInMinutes < 1) return 'Just now'
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`

      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) return `${diffInHours}h ago`

      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays}d ago`

      return dateObj.toLocaleDateString()
    }, [])

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}
      >
        <div className="flex gap-3 mb-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={comment.author.image || '/placeholder.svg'} />
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs">
              {comment.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-800">
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatTime(comment.createdAt)}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
              {comment.content}
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-2 text-xs gap-1 ${
                  comment.isLiked
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => onLike(comment.id)}
              >
                <Heart
                  className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`}
                />
                {comment.likes}
              </Button>

              {!isReply && depth < 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs gap-1 text-gray-500 hover:text-gray-700"
                  onClick={() => onReply(comment.id)}
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </Button>
              )}
            </div>

            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3"
              >
                <div className="flex gap-2">
                  <Input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyPress={(e) => onKeyPress(e, true)}
                    placeholder="Write a reply..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={onSubmitReply}
                    disabled={!replyContent.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {comment.replies && comment.replies.length > 0 && depth < 2 && (
              <div className="mt-4 space-y-3">
                {comment.replies.slice(0, 5).map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    isReply={true}
                    depth={depth + 1}
                    onLike={onLike}
                    onReply={onReply}
                    replyingTo={replyingTo}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    onSubmitReply={onSubmitReply}
                    onKeyPress={onKeyPress}
                  />
                ))}
                {comment.replies.length > 5 && (
                  <div className="text-xs text-gray-500 ml-8">
                    ... and {comment.replies.length - 5} more replies
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }
)

CommentItem.displayName = 'CommentItem'

export default function MemoryView({ memoryId, currentUser }: MemoryViewProps) {
  const [memory, setMemory] = useState<Memory | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const fetchMemoryAndComments = useCallback(async () => {
    console.log('[v0] Fetching memory and comments for:', memoryId)
    try {
      const memoryResponse = await fetch(`/api/memories/${memoryId}`)
      const commentsResponse = await fetch(`/api/memories/${memoryId}/comments`)

      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json()
        console.log('[v0] Memory data received:', memoryData)
        setMemory(memoryData)
      }

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        console.log('[v0] Comments data received:', commentsData)
        setComments(commentsData)
      }
    } catch (error) {
      console.error('Failed to fetch memory or comments:', error)
    } finally {
      setLoading(false)
    }
  }, [memoryId])

  useEffect(() => {
    let isMounted = true

    if (isMounted) {
      fetchMemoryAndComments()
    }

    return () => {
      isMounted = false
    }
  }, [fetchMemoryAndComments])

  const handleAddComment = useCallback(
    async (content: string) => {
      try {
        const response = await fetch(`/api/memories/${memoryId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        })

        if (response.ok) {
          const newComment = await response.json()
          setComments((prev) => [newComment, ...prev])
        }
      } catch (error) {
        console.error('Failed to add comment:', error)
      }
    },
    [memoryId]
  )

  const handleLikeComment = useCallback(
    async (commentId: string) => {
      try {
        const response = await fetch(
          `/api/memories/${memoryId}/comments/${commentId}/like`,
          {
            method: 'POST',
          }
        )

        if (response.ok) {
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    likes: comment.isLiked
                      ? comment.likes - 1
                      : comment.likes + 1,
                    isLiked: !comment.isLiked,
                  }
                : comment
            )
          )
        }
      } catch (error) {
        console.error('Failed to like comment:', error)
      }
    },
    [memoryId]
  )

  const handleReplyToComment = useCallback(
    async (commentId: string, content: string) => {
      try {
        const response = await fetch(
          `/api/memories/${memoryId}/comments/${commentId}/reply`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
          }
        )

        if (response.ok) {
          const newReply = await response.json()
          setComments((prev) =>
            prev.map((comment) =>
              comment.id === commentId
                ? { ...comment, replies: [...comment.replies, newReply] }
                : comment
            )
          )
        }
      } catch (error) {
        console.error('Failed to reply to comment:', error)
      }
    },
    [memoryId]
  )

  const handleSubmitComment = useCallback(() => {
    if (!newComment.trim()) return
    handleAddComment(newComment)
    setNewComment('')
  }, [newComment, handleAddComment])

  const handleSubmitReply = useCallback(() => {
    if (!replyContent.trim() || !replyingTo) return
    handleReplyToComment(replyingTo, replyContent)
    setReplyContent('')
    setReplyingTo(null)
  }, [replyContent, replyingTo, handleReplyToComment])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, isReply = false) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (isReply) {
          handleSubmitReply()
        } else {
          handleSubmitComment()
        }
      }
    },
    [handleSubmitReply, handleSubmitComment]
  )

  console.log('[v0] MemoryView rendering with memoryId:', memoryId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/memories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Memories
            </Link>
          </Button>

          {memory && (
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <div className="h-96 overflow-hidden rounded-t-lg">
                <img
                  src={memory.imageUrl || '/placeholder.svg'}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-3xl text-gray-800">
                  {memory.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{memory.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(memory.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {memory.description}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-100"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Comments</h3>
                  <p className="text-gray-600 text-sm">
                    Share your thoughts and memories
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </div>
            </motion.div>

            <motion.div
              className="p-6 border-b border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={currentUser?.image || '/placeholder.svg'} />
                  <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                    {currentUser?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Write a comment..."
                    className="mb-3"
                  />

                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Press Enter to post, Shift+Enter for new line
                    </p>

                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="p-6">
              {comments.length === 0 ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">
                    No comments yet
                  </h4>
                  <p className="text-gray-500 text-sm">
                    Be the first to share your thoughts!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <AnimatePresence>
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        onLike={handleLikeComment}
                        onReply={setReplyingTo}
                        replyingTo={replyingTo}
                        replyContent={replyContent}
                        setReplyContent={setReplyContent}
                        onSubmitReply={handleSubmitReply}
                        onKeyPress={handleKeyPress}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
