"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate: string
  showPhotos?: boolean
}

export default function CountdownTimer({ targetDate, showPhotos = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!isClient) {
    return (
      <div className="h-32 bg-gradient-to-r from-blue-800/50 to-purple-800/50 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-white text-lg">Loading countdown...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Main Countdown Display */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        <CountdownItem value={timeLeft.days} label="Days" icon={Calendar} />
        <CountdownItem value={timeLeft.hours} label="Hours" icon={Clock} />
        <CountdownItem value={timeLeft.minutes} label="Minutes" icon={Clock} />
        <CountdownItem value={timeLeft.seconds} label="Seconds" icon={Clock} />
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-full p-1">
          <div
            className="h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.max(0, Math.min(100, ((new Date(targetDate).getTime() - new Date().getTime()) / (new Date(targetDate).getTime() - new Date('2024-01-01').getTime())) * 100))}%`
            }}
          />
        </div>
        <p className="text-center text-blue-200 text-sm mt-2">
          Progress to Graduation Day
        </p>
      </div>
    </div>
  )
}

interface CountdownItemProps {
  value: number
  label: string
  icon: any
}

function CountdownItem({ value, label, icon: Icon }: CountdownItemProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="bg-gradient-to-br from-blue-800 via-purple-800 to-blue-900 text-white rounded-2xl w-24 h-24 md:w-28 md:h-28 flex items-center justify-center text-3xl md:text-4xl font-bold mb-3 relative overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl transform -skew-x-12 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-2xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-2xl"></div>
          
          {/* Icon overlay */}
          <div className="absolute top-2 right-2 opacity-30">
            <Icon className="w-4 h-4" />
          </div>
          
          {/* Number */}
          <span className="relative z-10">
            {value.toString().padStart(2, "0")}
          </span>
        </div>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <span className="text-blue-200 font-medium text-sm md:text-base">{label}</span>
    </div>
  )
}
