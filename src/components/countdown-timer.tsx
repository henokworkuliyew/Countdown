"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  targetDate: string
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
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
    return <div className="h-32 bg-blue-800/50 animate-pulse rounded-lg"></div>
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
      <CountdownItem value={timeLeft.days} label="Days" />
      <CountdownItem value={timeLeft.hours} label="Hours" />
      <CountdownItem value={timeLeft.minutes} label="Minutes" />
      <CountdownItem value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}

interface CountdownItemProps {
  value: number
  label: string
}

function CountdownItem({ value, label }: CountdownItemProps) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white rounded-lg w-24 h-24 flex items-center justify-center text-4xl font-bold mb-2 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-yellow-500/10 rounded-lg transform -skew-x-12"></div>
        <motion.span key={value} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative">
          {value.toString().padStart(2, "0")}
        </motion.span>
      </div>
      <span className="text-blue-200 font-medium">{label}</span>
    </motion.div>
  )
}
