import eventEmitter from "../lib/events.js";
import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Listen for the 'newMessage' event
eventEmitter.on("newMessage", async (message) => {
  // Start a Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a new notification
    const notification = new Notification({
      recipient: message.receiverId,
      sender: message.senderId,
      type: "MESSAGE",
      target: message._id,
      targetModel: "MESSAGE",
    });

    // Save the notification to the database within the transaction
    await notification.save({ session });

    // Update the recipient's unreadNotifications to include the new notification ID
    // This ensures the notification count is updated for the receiver
    await User.findByIdAndUpdate(
      message.receiverId,
      { $push: { unreadNotifications: notification._id } },
      { session }
    );

    // Commit the transaction to save all changes
    await session.commitTransaction();
    session.endSession();

    // Get the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(message.receiverId);

    // If the receiver is connected, emit a 'newNotification' event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error in newMessage event listener:", error.message);
  }
});

eventEmitter.on("newComment", async ({ comment, postAuthor }) => {
  // Start a Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a new notification
    const notification = new Notification({
      recipient: postAuthor,
      sender: comment.user,
      type: "COMMENT",
      target: comment.post,
      targetModel: "POST",
    });

    // Save the notification to the database within the transaction
    await notification.save({ session });

    // Update the recipient's unreadNotifications to include the new notification ID
    await User.findByIdAndUpdate(
      postAuthor,
      { $push: { unreadNotifications: notification._id } },
      { session }
    );

    // Commit the transaction to save all changes
    await session.commitTransaction();
    session.endSession();

    // Get the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(postAuthor);

    // If the receiver is connected, emit a 'newNotification' event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error in newComment event listener:", error.message);
  }
});

eventEmitter.on("newEvent", async ({ event, creatorId }) => {
  // Start a Mongoose session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a new notification
    const notification = new Notification({
      recipient: creatorId,
      sender: event.creator, // Assuming event.creator is the user who created the event
      type: "EVENT",
      target: event._id,
      targetModel: "EVENT",
    });

    // Save the notification to the database within the transaction
    await notification.save({ session });

    // Update the recipient's unreadNotifications to include the new notification ID
    await User.findByIdAndUpdate(
      creatorId,
      { $push: { unreadNotifications: notification._id } },
      { session }
    );

    // Commit the transaction to save all changes
    await session.commitTransaction();
    session.endSession();

    // Get the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(creatorId);

    // If the receiver is connected, emit a 'newNotification' event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error in newEvent event listener:", error.message);
  }
});
