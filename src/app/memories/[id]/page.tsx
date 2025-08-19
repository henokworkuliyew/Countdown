// Converting to proper Server Component structure
import { Suspense } from 'react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { getMemoryById } from '@/lib/memory-service'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import MemoryView from '@/components/memory-view'

interface MemoryPageProps {
  params: Promise<{ id: string }>
}

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const memory = await getMemoryById(id)
  const currentUser = session?.user || null
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
          {/* Using MemoryView Client Component to handle all interactions */}
          {/* Added key prop to prevent React from reusing components incorrectly */}
          <MemoryView key={id} memoryId={id} currentUser={currentUser} />
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
