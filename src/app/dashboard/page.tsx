import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserMemories } from "@/lib/memory-service"
import { formatDistanceToNow } from "date-fns"
import CountdownTimer from "@/components/countdown-timer"
import { Calendar, ImageIcon, MessageSquare, Plus, Trophy, Star, Users, TrendingUp } from "lucide-react"
import { authOptions } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?redirect=/dashboard")
  }

  const userMemories = await getUserMemories(session.user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back, {session.user.name}! 🎓</h1>
              <p className="text-xl text-blue-200">Your graduation journey dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="memories" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
                <TabsTrigger value="memories" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  My Memories
                </TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Recent Activity
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="memories" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Memories</h2>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" asChild>
                    <Link href="/memories/create">
                      <Plus className="mr-2 h-4 w-4" /> Add Memory
                    </Link>
                  </Button>
                </div>

                {userMemories.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                        <ImageIcon className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-gray-800">No memories yet</h3>
                      <p className="text-gray-600 text-center mb-8 max-w-md">
                        Start sharing your favorite moments from your time at Bahirdar University. 
                        Create memories that will last a lifetime!
                      </p>
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" asChild>
                        <Link href="/memories/create">Create Your First Memory</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userMemories.map((memory) => (
                      <Card key={memory._id.toString()} className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={memory.imageUrl || "/placeholder.svg"}
                            alt={memory.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <CardHeader className="p-6 pb-0">
                          <CardTitle className="text-xl text-gray-800">{memory.title}</CardTitle>
                          <CardDescription className="text-gray-600">
                            {formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                          <p className="text-gray-600 line-clamp-2 mb-4">{memory.description}</p>
                          <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" asChild>
                              <Link href={`/memories/${memory._id}`}>View</Link>
                            </Button>
                            <Button size="sm" variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50" asChild>
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
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-800">Recent Activity</CardTitle>
                    <CardDescription className="text-gray-600">Stay updated with the latest activities from your classmates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Tigist Haile shared a new memory</p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                          <p className="mt-1 text-gray-600">"Our final project presentation day was unforgettable!"</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Dawit Mekonnen commented on your memory</p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                          <p className="mt-1 text-gray-600">
                            "That was such a fun day! I remember how we stayed up all night to finish the project."
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Graduation ceremony details updated</p>
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
            {/* Enhanced Countdown Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Graduation Countdown</CardTitle>
                <CardDescription className="text-blue-100">Time remaining until our graduation ceremony</CardDescription>
              </CardHeader>
              <CardContent>
                <CountdownTimer targetDate="2025-07-15T09:00:00" showPhotos={true} />
              </CardContent>
            </Card>

            {/* Quick Links Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-white hover:bg-blue-50 border-blue-200 text-blue-600" asChild>
                    <Link href="/memories">
                      <ImageIcon className="mr-3 h-4 w-4" /> Browse All Memories
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-white hover:bg-green-50 border-green-200 text-green-600" asChild>
                    <Link href="/chat">
                      <MessageSquare className="mr-3 h-4 w-4" /> Chat with Classmates
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-white hover:bg-purple-50 border-purple-200 text-purple-600" asChild>
                    <Link href="/countdown">
                      <Calendar className="mr-3 h-4 w-4" /> View Countdown
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Your Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Memories Shared</span>
                    <span className="font-bold text-2xl">{userMemories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Days to Graduation</span>
                    <span className="font-bold text-2xl">
                      {Math.ceil((new Date('2025-07-15T09:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
