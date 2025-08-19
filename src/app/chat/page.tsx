import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ChatSystem from '@/components/chat-system'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ChatPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login?redirect=/chat')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">CS Class Chat</h1>
          <p className="text-blue-200">
            Connect with your classmates in real-time
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense
              fallback={
                <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
              }
            >
              <ChatSystem />
            </Suspense>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Chat Guidelines</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Be respectful to all classmates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Share graduation-related information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Coordinate meetups and events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Help each other with graduation preparations</span>
                </li>
              </ul>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-3">
                  <h3 className="font-medium">Graduation Rehearsal</h3>
                  <p className="text-sm text-gray-500">
                    July 13, 2025 • 10:00 AM
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-3">
                  <h3 className="font-medium">Cap & Gown Distribution</h3>
                  <p className="text-sm text-gray-500">
                    July 14, 2025 • 9:00 AM
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <h3 className="font-medium">Graduation Ceremony</h3>
                  <p className="text-sm text-gray-500">
                    July 15, 2025 • 9:00 AM
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link href="/events">View All Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
