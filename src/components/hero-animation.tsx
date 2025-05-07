"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 1
        this.speedY = (Math.random() - 0.5) * 1
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.5 + 0.3})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles
    const particles: Particle[] = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw graduation cap
      drawGraduationCap(ctx, canvas.width / 2, canvas.height / 2, 80)

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      // Draw connections between particles
      drawConnections(ctx, particles)

      requestAnimationFrame(animate)
    }

    // Draw graduation cap
    function drawGraduationCap(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      // Base of cap
      ctx.fillStyle = "#1e40af"
      ctx.beginPath()
      ctx.rect(x - size / 2, y, size, size / 5)
      ctx.fill()

      // Top of cap
      ctx.fillStyle = "#1e40af"
      ctx.beginPath()
      ctx.moveTo(x - size / 2, y)
      ctx.lineTo(x + size / 2, y)
      ctx.lineTo(x, y - size / 2)
      ctx.closePath()
      ctx.fill()

      // Tassel
      ctx.strokeStyle = "#fcd34d"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(x, y - size / 2)
      ctx.quadraticCurveTo(x + size / 2, y - size / 4, x + size / 2 + 20, y + size / 4)
      ctx.stroke()

      // Tassel end
      ctx.fillStyle = "#fcd34d"
      ctx.beginPath()
      ctx.arc(x + size / 2 + 20, y + size / 4 + 5, 5, 0, Math.PI * 2)
      ctx.fill()

      // Button on top
      ctx.fillStyle = "#fcd34d"
      ctx.beginPath()
      ctx.arc(x, y - size / 2, 5, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw connections between particles
    function drawConnections(ctx: CanvasRenderingContext2D, particles: Particle[]) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-4 text-blue-900 font-bold text-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        BDU CS 2025
      </motion.div>
    </div>
  )
}
