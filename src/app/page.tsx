import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getLatestMemories } from "@/lib/memory-service"
import HeroSection from "@/components/hero-section"
import MainNavigation from "@/components/main-navigation"
import { connectToDatabase } from "../lib/mongodb"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const latestMemories = await getLatestMemories(3)
  connectToDatabase()
  
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      
      <main className="flex-1">
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          {/* Hero Section */}
          <section className="py-16 md:py-24 container mx-auto px-4 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
              <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-blue-900 dark:text-blue-100 mb-4">
                  Computer Science <span className="text-yellow-600 dark:text-yellow-400">Graduation</span>
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  Celebrating our journey through Bahirdar University's Computer Science program. The countdown to our big
                  day has begun!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {session ? (
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/dashboard">
                        Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/auth/signup">
                        Join the Celebration <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/memories">View Memories</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[300px] md:h-[400px]">
                <HeroSection />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Celebrate Together</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Join our platform to connect with classmates, share memories, and countdown to our graduation day.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Countdown Timer</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Keep track of the days, hours, minutes, and seconds until our graduation ceremony.
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Share Memories</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Upload and share your favorite moments from our time at Bahirdar University.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Chat with Classmates</h3>
                  <p className="text-gray-600 dark:text-gray-400">Connect with your fellow graduates and share your experiences and plans.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Latest Memories Preview */}
          {latestMemories.length > 0 && (
            <section className="py-16 bg-gray-50 dark:bg-gray-700">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-4">Latest Memories</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Check out the most recent memories shared by your classmates.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {latestMemories.map((memory) => (
                    <div key={memory._id.toString()} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={memory.imageUrl || "/placeholder.svg"}
                          alt={memory.title}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{memory.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{memory.description}</p>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/memories/${memory._id}`}>View Memory</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button asChild>
                    <Link href="/memories">View All Memories</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="py-16 bg-blue-900 dark:bg-blue-800 text-white">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Sign up now to connect with classmates, share memories, and countdown to our graduation day.
              </p>
              {!session && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-800" asChild>
                    <Link href="/auth/login">Log In</Link>
                  </Button>
                  <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
              {session && (
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-10 w-10 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold">
                      BDU
                    </div>
                    <h3 className="text-xl font-bold">CS Graduation</h3>
                  </div>
                  <p className="text-gray-400">
                    Celebrating the achievements of Bahirdar University Computer Science graduates of 2025.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link href="/" className="text-gray-400 hover:text-white">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/countdown" className="text-gray-400 hover:text-white">
                        Countdown
                      </Link>
                    </li>
                    <li>
                      <Link href="/memories" className="text-gray-400 hover:text-white">
                        Memories
                      </Link>
                    </li>
                    <li>
                      <Link href="/chat" className="text-gray-400 hover:text-white">
                        Chat
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <p className="text-gray-400 mb-2">Bahirdar University</p>
                  <p className="text-gray-400 mb-2">Computer Science Department</p>
                  <p className="text-gray-400">Bahir Dar, Ethiopia</p>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>© 2025 Bahirdar University Computer Science Graduation. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
