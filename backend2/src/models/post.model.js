import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    picture: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: Array[mongoose.Schema.Types.ObjectId],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
