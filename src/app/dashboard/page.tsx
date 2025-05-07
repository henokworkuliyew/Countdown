import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserMemories } from "@/lib/memory-service"
import { formatDistanceToNow } from "date-fns"
import CountdownTimer from "@/components/countdown-timer"
import { Calendar, ImageIcon, MessageSquare, Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?redirect=/dashboard")
  }

  const userMemories = await getUserMemories(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Welcome, {session.user.name}!</h1>
          <p className="text-blue-200">Manage your memories and connect with classmates</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="memories" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="memories">My Memories</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="memories" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Your Memories</h2>
                  <Button asChild>
                    <Link href="/memories/create">
                      <Plus className="mr-2 h-4 w-4" /> Add Memory
                    </Link>
                  </Button>
                </div>

                {userMemories.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <div className="rounded-full bg-blue-100 p-3 mb-4">
                        <ImageIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No memories yet</h3>
                      <p className="text-gray-500 text-center mb-6">
                        Share your favorite moments from your time at Bahirdar University.
                      </p>
                      <Button asChild>
                        <Link href="/memories/create">Create Your First Memory</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userMemories.map((memory) => (
                      <Card key={memory._id.toString()} className="overflow-hidden">
                        <div className="h-40 overflow-hidden">
                          <img
                            src={memory.imageUrl || "/placeholder.svg"}
                            alt={memory.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="text-lg">{memory.title}</CardTitle>
                          <CardDescription>
                            {formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                          <p className="text-gray-600 line-clamp-2">{memory.description}</p>
                          <div className="flex gap-4 mt-4">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/memories/${memory._id}`}>View</Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/memories/edit/${memory._id}`}>Edit</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Stay updated with the latest activities from your classmates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <ImageIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Tigist Haile shared a new memory</p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                          <p className="mt-1 text-gray-600">"Our final project presentation day was unforgettable!"</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Dawit Mekonnen commented on your memory</p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                          <p className="mt-1 text-gray-600">
                            "That was such a fun day! I remember how we stayed up all night to finish the project."
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Graduation ceremony details updated</p>
                          <p className="text-sm text-gray-500">1 day ago</p>
                          <p className="mt-1 text-gray-600">
                            The graduation ceremony will now start at 9:00 AM instead of 10:00 AM.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Graduation Countdown</CardTitle>
                <CardDescription>Time remaining until our graduation ceremony</CardDescription>
              </CardHeader>
              <CardContent>
                <CountdownTimer targetDate="2025-07-15T09:00:00" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/memories">
                      <ImageIcon className="mr-2 h-4 w-4" /> Browse All Memories
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/chat">
                      <MessageSquare className="mr-2 h-4 w-4" /> Chat with Classmates
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/countdown">
                      <Calendar className="mr-2 h-4 w-4" /> View Countdown
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
