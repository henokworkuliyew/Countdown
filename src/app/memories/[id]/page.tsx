import { Suspense } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { getMemoryById } from '@/lib/memory-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Share2, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/comment-section'
import { authOptions } from '@/lib/auth'


interface MemoryPageProps {
  params: {
    id: string
  }
}
export default async function MemoryPage({ params }: MemoryPageProps) {
  const session = await getServerSession(authOptions)
  const memory = await getMemoryById(params.id)

  if (!memory) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/memories">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Memories
          </Link>
        </Button>

        <Suspense fallback={<MemoryLoading />}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-[400px]">
                  <img
                    src={memory.imageUrl || '/placeholder.svg'}
                    alt={memory.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-blue-100">
                      <img
                        src={
                          memory.author.image ||
                          '/placeholder.svg?height=40&width=40'
                        }
                        alt={memory.author.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{memory.author.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(memory.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{memory.title}</h1>
                  <p className="text-gray-700 whitespace-pre-line">
                    {memory.description}
                  </p>

                  <div className="flex items-center gap-6 mt-8 pt-4 border-t">
                    <Button variant="ghost" className="gap-2">
                      <Heart className="h-5 w-5" />
                      <span>{memory.likes}</span>
                    </Button>
                    <Button variant="ghost" className="gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span>{memory.comments.length}</span>
                    </Button>
                    <Button variant="ghost" className="gap-2">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <CommentSection
                    memoryId={memory._id.toString()}
                    comments={memory.comments}
                    onAddComment={async (content: string) => {
                      // TODO: Implement add comment functionality
                      console.log('[v0] Adding comment:', content)
                    }}
                    onLikeComment={async (commentId: string) => {
                      // TODO: Implement like comment functionality
                      console.log('[v0] Liking comment:', commentId)
                    }}
                    onReplyToComment={async (
                      commentId: string,
                      content: string
                    ) => {
                      // TODO: Implement reply to comment functionality
                      console.log(
                        '[v0] Replying to comment:',
                        commentId,
                        content
                      )
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}

function MemoryLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="h-[400px] bg-gray-200 animate-pulse"></div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="h-8 w-3/4 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
