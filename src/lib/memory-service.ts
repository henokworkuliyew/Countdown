import { connectToDatabase } from '@/lib/mongodb'
import { Memory } from '@/models/memory'
import { Types } from 'mongoose'

export async function getAllMemories() {
  try {
    await connectToDatabase()

    const memories = await Memory.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name image')
      .exec()

    return memories
  } catch (error) {
    console.error('Error fetching all memories:', error)
    return []
  }
}

export async function getLatestMemories(limit = 3) {
  try {
    await connectToDatabase()

    const memories = await Memory.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('author', 'name image')
      .exec()

    return memories
  } catch (error) {
    console.error('Error fetching latest memories:', error)
    return []
  }
}

export async function getMemoryById(id: string) {
  

  try {
    if (!Types.ObjectId.isValid(id)) {
      return null
    }

    await connectToDatabase()

    const memory = await Memory.findById(id)
      .populate('author', 'name image')
      .populate('comments.author', 'name image')
      .populate('comments.replies.author', 'name image')
      .exec()

    return memory
    console.log(`Fetching memory with id: ${id}`)
  } catch (error) {
    console.error(`Error fetching memory with id ${id}:`, error)
    return null
  }
}

export async function getUserMemories(userId: string) {
  try {
    await connectToDatabase()

    const memories = await Memory.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name image')
      .exec()

    return memories
  } catch (error) {
    console.error(`Error fetching memories for user ${userId}:`, error)
    return []
  }
}
