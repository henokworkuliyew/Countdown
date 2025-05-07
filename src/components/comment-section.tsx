"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"
import Link from "next/link"

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    name: string
    image?: string
  }
  createdAt: string
}

interface CommentSectionProps {
  memoryId: string
  comments: Comment[]
}

export default function CommentSection({ memoryId, comments: initialComments }: CommentSectionProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      router.push("/auth/login?redirect=/memories/" + memoryId)
      return
    }

    if (!newComment.trim()) return

    try {
      setIsSubmitting(true)

      const response = await fetch(`/api/memories/${memoryId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const result = await response.json()

      setComments([...comments, result.comment])
      setNewComment("")
      router.refresh()
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>

      {session ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-24"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      ) : (
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-blue-800 mb-2">Sign in to join the conversation</p>
          <Button size="sm" asChild>
            <Link href={`/auth/login?redirect=/memories/${memoryId}`}>Sign In</Link>
          </Button>
        </div>
      )}

      <div className="space-y-6 mt-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={comment.author.image || "/placeholder.svg?height=32&width=32"}
                    alt={comment.author.name}
                  />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{comment.author.name}</p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
