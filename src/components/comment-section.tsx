'use client'

import type React from 'react'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Heart, Reply, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: Date
  likes: number
  replies: Comment[]
  isLiked?: boolean
}

interface CommentSectionProps {
  memoryId: string
  comments: Comment[]
  onAddComment: (content: string) => void
  onLikeComment: (commentId: string) => void
  onReplyToComment: (commentId: string, content: string) => void
  className?: string
}

export default function CommentSection({
  memoryId,
  comments,
  onAddComment,
  onLikeComment,
  onReplyToComment,
  className = '',
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    onAddComment(newComment)
    setNewComment('')
  }

  const handleSubmitReply = () => {
    if (!replyContent.trim() || !replyingTo) return
    onReplyToComment(replyingTo, replyContent)
    setReplyContent('')
    setReplyingTo(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent, isReply = false) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (isReply) {
        handleSubmitReply()
      } else {
        handleSubmitComment()
      }
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return date.toLocaleDateString()
  }

  const CommentItem = ({
    comment,
    isReply = false,
  }: {
    comment: Comment
    isReply?: boolean
  }) => (
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
              onClick={() => onLikeComment(comment.id)}
            >
              <Heart
                className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`}
              />
              {comment.likes}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1 text-gray-500 hover:text-gray-700"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="w-3 h-3" />
                Reply
              </Button>
            )}
          </div>

          {/* Reply Input */}
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
                  onKeyPress={(e) => handleKeyPress(e, true)}
                  placeholder="Write a reply..."
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header */}
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

      {/* Comment Input */}
      <motion.div
        className="p-6 border-b border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
              <User className="w-4 h-4" />
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

      {/* Comments List */}
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
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
