import mongoose, { Schema, type Document } from 'mongoose'

interface IReply {
  _id: mongoose.Types.ObjectId
  content: string
  author: mongoose.Types.ObjectId
  createdAt: Date
  likes: number
}

interface IComment {
  _id: mongoose.Types.ObjectId
  content: string
  author: mongoose.Types.ObjectId
  createdAt: Date
  likes: number
  replies: IReply[] // Using IReply instead of IComment to break circular reference
}

export interface IMemory extends Document {
  title: string
  description: string
  imageUrl?: string
  author: mongoose.Types.ObjectId
  likes: number
  comments: IComment[]
  createdAt: Date
  updatedAt: Date
}

const ReplySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    replies: [ReplySchema], // Using ReplySchema instead of inline definition
  },
  {
    timestamps: true,
  }
)

const MemorySchema = new Schema<IMemory>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [CommentSchema],
  },
  {
    timestamps: true,
  }
)

export const Memory =
  mongoose.models.Memory || mongoose.model<IMemory>('Memory', MemorySchema)
