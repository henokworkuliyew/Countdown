// import { type NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
// import { connectToDatabase } from '@/lib/mongodb'
// import { Memory } from '@/models/memory'
// import { z } from 'zod'
// import { authOptions } from '@/lib/auth'


// const commentSchema = z.object({
//   content: z.string().min(1).max(500),
// })

// export async function POST(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { params } = context

//     // Authenticate user
//     const session = await getServerSession(authOptions)
//     if (!session || !session.user?.id) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
//     }

//     // Parse and validate request body
//     const body = await req.json()
//     const result = commentSchema.safeParse(body)
//     if (!result.success) {
//       return NextResponse.json(
//         { message: 'Invalid input', errors: result.error.errors },
//         { status: 400 }
//       )
//     }

//     const { content } = result.data

//     // Connect to database
//     await connectToDatabase()

//     // Find memory
//     const memory = await Memory.findById(params.id)
//     if (!memory) {
//       return NextResponse.json({ message: 'Memory not found' }, { status: 404 })
//     }

//     // Add comment
//     const comment = {
//       content,
//       author: session.user.id,
//       createdAt: new Date(),
//     }

//     memory.comments.push(comment)
//     await memory.save()

//     // Get the newly added comment with author details
//     const populatedMemory = await Memory.findById(params.id).populate(
//       'comments.author',
//       'name image'
//     )

//     // Ensure populatedMemory exists
//     if (!populatedMemory) {
//       return NextResponse.json(
//         { message: 'Failed to retrieve updated memory' },
//         { status: 500 }
//       )
//     }

//     const newComment =
//       populatedMemory.comments[populatedMemory.comments.length - 1]

//     return NextResponse.json(
//       {
//         message: 'Comment added successfully',
//         comment: newComment,
//       },
//       { status: 201 }
//     )
//   } catch (error) {
//     console.error('Add comment error:', error)
//     return NextResponse.json(
//       { message: 'An error occurred while adding the comment' },
//       { status: 500 }
//     )
//   }
// }
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello from the API!' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Posted data!' })
}
