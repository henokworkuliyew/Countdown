import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Memory } from "@/models/memory"
import { z } from "zod"

const memorySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  imageUrl: z.string().url(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const result = memorySchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.errors }, { status: 400 })
    }

    const { title, description, imageUrl } = result.data

    // Connect to database
    await connectToDatabase()

    // Create new memory
    const memory = await Memory.create({
      title,
      description,
      imageUrl,
      author: session.user.id,
    })

    // Populate author details
    await memory.populate("author", "name image")

    return NextResponse.json(
      {
        message: "Memory created successfully",
        memory,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create memory error:", error)
    return NextResponse.json({ message: "An error occurred while creating the memory" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Connect to database
    await connectToDatabase()

    // Get all memories with author details
    const memories = await Memory.find().sort({ createdAt: -1 }).populate("author", "name image").exec()

    return NextResponse.json({ memories })
  } catch (error) {
    console.error("Get memories error:", error)
    return NextResponse.json({ message: "An error occurred while fetching memories" }, { status: 500 })
  }
}
