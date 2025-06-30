import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
  {
    // The user who is initiating the follow
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // The user who is being followed
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followBack: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// To prevent a user from following the same person multiple times
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);

export default Follow;
