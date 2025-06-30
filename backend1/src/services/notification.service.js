import eventEmitter from "../lib/events.js";
import Notification from "../models/notification.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Listen for the 'newMessage' event
eventEmitter.on("newMessage", async (message) => {
  try {
    // Create a new notification
    const notification = new Notification({
      recipient: message.receiverId,
      sender: message.senderId,
      type: "MESSAGE",
      target: message._id,
    });

    // Save the notification to the database
    await notification.save();

    // Get the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(message.receiverId);

    // If the receiver is connected, emit a 'newNotification' event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    console.error("Error in newMessage event listener:", error.message);
  }
});

// Listen for the 'newFollow' event
eventEmitter.on("newFollow", async ({ followerId, followingId }) => {
  try {
    // Create a new notification
    const notification = new Notification({
      recipient: followingId,
      sender: followerId,
      type: "FOLLOW",
    });

    // Save the notification to the database
    await notification.save();

    // Get the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(followingId);

    // If the receiver is connected, emit a 'newNotification' event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    console.error("Error in newFollow event listener:", error.message);
  }
});

// Listen for the 'newLike' event
eventEmitter.on("newLike", async ({ postId, userId, postAuthor }) => {
  try {
    // Create a new notification
    const notification = new Notification({
      recipient: postAuthor,
      sender: userId,
      type: "LIKE",
      target: postId,
    });

    // Save the notification to the database
    await notification.save();

    // Get the receiver's socket ID
    const receiverSocketId = getReceiverSocketId(postAuthor);

    // If the receiver is connected, emit a 'newNotification' event
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newNotification", notification);
    }
  } catch (error) {
    console.error("Error in newLike event listener:", error.message);
  }
});
