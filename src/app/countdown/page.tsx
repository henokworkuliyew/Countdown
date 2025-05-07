import { Calendar, Users, MessageSquare } from "lucide-react"
import CountdownTimer from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CountdownPage() {
  return (
    <div className="min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10 opacity-20"
        style={{
          backgroundImage: "url('/graduation-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900/70 to-blue-900/90 -z-10"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 text-white">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Countdown to Graduation</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Our journey at Bahirdar University Computer Science Department is coming to its grand finale. Let's count
            down together to our special day!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CountdownTimer targetDate="2025-07-15T09:00:00" />
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center">
            <Calendar className="h-12 w-12 mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold mb-2">Graduation Ceremony</h3>
            <p className="text-blue-200 text-center">July 15, 2025 • 9:00 AM</p>
            <p className="text-blue-200 text-center mt-2">Main Auditorium, Bahirdar University</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center">
            <Users className="h-12 w-12 mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold mb-2">Class Reunion</h3>
            <p className="text-blue-200 text-center">July 16, 2025 • 6:00 PM</p>
            <p className="text-blue-200 text-center mt-2">Blue Nile Hotel, Bahir Dar</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg flex flex-col items-center">
            <MessageSquare className="h-12 w-12 mb-4 text-yellow-400" />
            <h3 className="text-xl font-semibold mb-2">Farewell Party</h3>
            <p className="text-blue-200 text-center">July 17, 2025 • 8:00 PM</p>
            <p className="text-blue-200 text-center mt-2">Lakeside Resort, Bahir Dar</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Share This Moment</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-blue-700 hover:bg-blue-800" asChild>
              <Link href="/memories/create">Share a Memory</Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/chat">Chat with Classmates</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
