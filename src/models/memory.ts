import mongoose, { Schema, models } from "mongoose"

const commentSchema = new Schema({
  content: {
    type: String,
    required: [true, "Comment content is required"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Comment author is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const memorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  },
)

export const Memory = models.Memory || mongoose.model("Memory", memorySchema)
