import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId }],
    admins: [{ type: mongoose.Schema.Types.ObjectId }],
    chat: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);
