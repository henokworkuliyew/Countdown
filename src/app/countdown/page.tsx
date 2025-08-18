import { Calendar, Users, MessageSquare, Trophy, Star, Heart } from "lucide-react"
import CountdownTimer from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CountdownPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/graduation-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-purple-900/70 to-blue-900/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 text-white relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <Trophy className="h-6 w-6 text-yellow-400" />
            <span className="text-blue-200 font-medium">Class of 2025</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-yellow-200 bg-clip-text text-transparent">
            Countdown to Graduation
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            Our journey at Bahirdar University Computer Science Department is coming to its grand finale. 
            Let's count down together to our special day and celebrate the memories we've created!
          </p>
        </div>

        {/* Enhanced Countdown Timer with Photos */}
        <div className="max-w-6xl mx-auto mb-20">
          <CountdownTimer targetDate="2025-07-15T09:00:00" showPhotos={true} />
        </div>

        {/* Event Details */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Graduation Ceremony</h3>
              <div className="space-y-2 text-blue-200">
                <p className="text-lg font-semibold">July 15, 2025</p>
                <p className="text-lg">9:00 AM</p>
                <p className="text-sm">Main Auditorium</p>
                <p className="text-sm">Bahirdar University</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Class Reunion</h3>
              <div className="space-y-2 text-blue-200">
                <p className="text-lg font-semibold">July 16, 2025</p>
                <p className="text-lg">6:00 PM</p>
                <p className="text-sm">Blue Nile Hotel</p>
                <p className="text-sm">Bahir Dar</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Farewell Party</h3>
              <div className="space-y-2 text-blue-200">
                <p className="text-lg font-semibold">July 17, 2025</p>
                <p className="text-lg">8:00 PM</p>
                <p className="text-sm">Lakeside Resort</p>
                <p className="text-sm">Bahir Dar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
            Share This Moment
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
              asChild
            >
              <Link href="/memories/create">
                <Star className="mr-2 h-5 w-5" />
                Share a Memory
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-105" 
              asChild
            >
              <Link href="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with Classmates
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/10">
          <h3 className="text-2xl font-bold text-center mb-8 text-yellow-200">Our Journey Together</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <div className="text-blue-200 text-sm">Years of Study</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">120+</div>
              <div className="text-blue-200 text-sm">Classmates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-200 text-sm">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">∞</div>
              <div className="text-blue-200 text-sm">Memories Created</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
