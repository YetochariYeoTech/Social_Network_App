import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export const Tag = mongoose.model("Tag", tagSchema);
