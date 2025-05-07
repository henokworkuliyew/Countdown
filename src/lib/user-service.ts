import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/user'
import { Types } from 'mongoose'

export async function getUserById(id: string) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      return null
    }

    await connectToDatabase()

    const user = await User.findById(id).select('-password').exec()

    return user
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error)
    return null
  }
}

export async function updateUserProfile(
  id: string,
  data: { name?: string; image?: string; bio?: string }
) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID')
    }

    await connectToDatabase()

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password')

    return updatedUser
  } catch (error) {
    console.error(`Error updating user profile for id ${id}:`, error)
    throw error
  }
}

export async function changeUserPassword(
  id: string,
  currentPassword: string,
  newPassword: string
) {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user ID')
    }

    await connectToDatabase()

    // Logic to verify current password and set new password would go here
    // This typically requires bcryptjs for password verification and hashing

    return { success: true }
  } catch (error) {
    console.error(`Error changing password for user ${id}:`, error)
    throw error
  }
}
