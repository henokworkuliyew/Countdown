import { User } from '@/models/user'
import { connectToDatabase } from './mongodb'


export async function getUserByEmail(email: string) {
  try {
    await connectToDatabase()
    const user = await User.findOne({ email }).lean()
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(id).lean()
    return user
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    return null
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
}) {
  try {
    await connectToDatabase()
    const user = new User(userData)
    await user.save()
    return user.toObject()
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
