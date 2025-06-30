import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follower", "message", "MESSAGE", "COMMENT", "EVENT"],
      required: true
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // This refPath allows us to dynamically reference different models
      // For example, a 'new_like' or 'new_comment' could target a Post,
      // while a 'new_follower' could target a User.
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["POST", "USER", "MESSAGE", "EVENT", "FOLLOW", "GROUP", "COMMENT"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
