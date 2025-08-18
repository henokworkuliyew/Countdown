import { connectToDatabase } from './mongodb'
import { User, type IUser } from '@/models/user'

export async function getUserByEmail(email: string): Promise<IUser | null> {
  try {
    await connectToDatabase()
    const user = await User.findOne({ email }).lean<IUser>()
    return user
  } catch (error) {
    console.error('Error fetching user by email:', error)
    return null
  }
}

export async function getUserById(id: string): Promise<IUser | null> {
  try {
    await connectToDatabase()
    const user = await User.findById(id).lean<IUser>()
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
}): Promise<IUser> {
  try {
    await connectToDatabase()
    const user = new User(userData)
    await user.save()
    return user.toObject() as IUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
