import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import eventEmitter from "../lib/events.js";
import { validationResult } from "express-validator";

// Helper function for consistent error responses


export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Authorization check: Ensure the logged-in user is part of the conversation
    const isAuthorized = await User.exists({
      _id: myId,
      $or: [{ _id: userToChatId }, { _id: myId }],
    });
    if (!isAuthorized) {
      return sendErrorResponse(res, 403, "Unauthorized to view these messages");
    }

    const messages = await Message.find({
      $and: [
        { $or: [{ senderId: myId }, { receiverId: myId }] },
        { $or: [{ senderId: userToChatId }, { receiverId: userToChatId }] },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

export const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(res, 400, "Validation failed", errors.array());
  }

  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      try {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);
        return res.status(500).json({ message: "Error uploading file" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Emit an event when a new message is created
    eventEmitter.emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
