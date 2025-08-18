import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getAllMemories } from "@/lib/memory-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"

export default async function MemoriesPage() {
  const session = await getServerSession(authOptions)
  const memories = await getAllMemories()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Shared Memories</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
            Relive the best moments from our time at Bahirdar University Computer Science Department.
          </p>
          {session && (
            <Button className="bg-yellow-600 hover:bg-yellow-700" size="lg" asChild>
              <Link href="/memories/create">Share Your Memory</Link>
            </Button>
          )}
          {!session && (
            <div className="space-y-4">
              <p className="text-blue-200">Sign in to share your own memories</p>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 mr-4" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button className="bg-yellow-600 hover:bg-yellow-700" asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<MemoriesLoading />}>
          {memories.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No memories shared yet</h2>
              <p className="text-gray-500 mb-8">Be the first to share a memory from your time at BDU!</p>
              {session && (
                <Button asChild>
                  <Link href="/memories/create">Share a Memory</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <Card key={memory._id.toString()} className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <Link href={`/memories/${memory._id}`}>
                      <img
                        src={memory.imageUrl || "/placeholder.svg"}
                        alt={memory.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </Link>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-100">
                        <img
                          src={memory.author.image || "/placeholder.svg?height=32&width=32"}
                          alt={memory.author.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{memory.author.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Link href={`/memories/${memory._id}`} className="block">
                      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                        {memory.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 line-clamp-3">{memory.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between border-t">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      <span>{memory.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>{memory.comments.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

function MemoriesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden h-full">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between border-t">
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
