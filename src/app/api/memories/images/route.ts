import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Memory } from "@/models/memory"

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase()

    // Get all memory images
    const memories = await Memory.find({}, { imageUrl: 1 }).sort({ createdAt: -1 }).limit(10).exec()

    const images = memories.map((memory) => memory.imageUrl)

    // If no images found, return default image
    if (images.length === 0) {
      return NextResponse.json({
        images: ["/graduation-bg.png"],
      })
    }

    return NextResponse.json({ images })
  } catch (error) {
    console.error("Get memory images error:", error)
    return NextResponse.json(
      {
        message: "An error occurred while fetching memory images",
        images: ["/graduation-bg.png"], // Return default image on error
      },
      { status: 500 },
    )
  }
}
