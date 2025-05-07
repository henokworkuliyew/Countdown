"use client"

import { useState, useEffect } from "react"

export function useMemoryImages() {
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchImages() {
      try {
        setIsLoading(true)
        const response = await fetch("/api/memories/images")

        if (!response.ok) {
          throw new Error("Failed to fetch memory images")
        }

        const data = await response.json()
        setImages(data.images)
      } catch (err) {
        console.error("Error fetching memory images:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        // Fallback to default image if there's an error
        setImages(['/20250308_150634.jpg'])
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  return { images, isLoading, error }
}
