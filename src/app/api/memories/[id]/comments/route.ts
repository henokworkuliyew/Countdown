import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/mongodb"
import { Memory } from "@/models/memory"
import { z } from "zod"

const commentSchema = z.object({
  content: z.string().min(1).max(500),
})

interface Params {
  params: {
    id: string
  }
}

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const result = commentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.errors }, { status: 400 })
    }

    const { content } = result.data

    // Connect to database
    await connectToDatabase()

    // Find memory
    const memory = await Memory.findById(params.id)

    if (!memory) {
      return NextResponse.json({ message: "Memory not found" }, { status: 404 })
    }

    // Add comment
    const comment = {
      content,
      author: session.user.id,
      createdAt: new Date(),
    }

    memory.comments.push(comment)
    await memory.save()

    // Get the newly added comment with author details
    const populatedMemory = await Memory.findById(params.id).populate("comments.author", "name image")

    const newComment = populatedMemory.comments[populatedMemory.comments.length - 1]

    return NextResponse.json(
      {
        message: "Comment added successfully",
        comment: newComment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Add comment error:", error)
    return NextResponse.json({ message: "An error occurred while adding the comment" }, { status: 500 })
  }
}
