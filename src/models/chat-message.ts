import mongoose, { Schema, models } from 'mongoose'

const chatMessageSchema = new Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

export const ChatMessage =
  models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema)
