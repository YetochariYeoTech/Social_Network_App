import mongoose from "mongoose";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

/**
 * @desc Get all notifications for a user
 * @route GET /api/notifications
 * @access Private
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const groupedNotifications = await Notification.aggregate([
      {
        $match: { recipient: userId },
      },
      // Populate sender
      {
        $lookup: {
          from: "users", // Collection name for User model
          localField: "sender",
          foreignField: "_id",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      // Populate target based on targetModel
      {
        $lookup: {
          from: "messages", // Collection name for Message model
          localField: "target",
          foreignField: "_id",
          as: "messageTarget",
        },
      },
      {
        $lookup: {
          from: "posts", // Collection name for Post model
          localField: "target",
          foreignField: "_id",
          as: "postTarget",
        },
      },
      {
        $lookup: {
          from: "events", // Collection name for Event model
          localField: "target",
          foreignField: "_id",
          as: "eventTarget",
        },
      },
      {
        $addFields: {
          target: {
            $cond: {
              if: { $eq: ["$targetModel", "MESSAGE"] },
              then: { $arrayElemAt: ["$messageTarget", 0] },
              else: {
                $cond: {
                  if: { $eq: ["$targetModel", "POST"] },
                  then: { $arrayElemAt: ["$postTarget", 0] },
                  else: {
                    $cond: {
                      if: { $eq: ["$targetModel", "EVENT"] },
                      then: { $arrayElemAt: ["$eventTarget", 0] },
                      else: null, // Handle other targetModels or leave as null
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Remove temporary lookup fields
      {
        $project: {
          messageTarget: 0,
          postTarget: 0,
          eventTarget: 0,
        },
      },
      // Group by type
      {
        $group: {
          _id: "$type",
          notifications: { $push: "$ROOT" },
        },
      },
      // Transform array of grouped objects into a single object
      {
        $group: {
          _id: null, // Group all documents into a single one
          data: { $push: { k: "$_id", v: "$notifications" } },
        },
      },
      {
        $replaceRoot: { newRoot: { $arrayToObject: "$data" } },
      },
    ]);

    res.status(200).json(groupedNotifications);
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Mark a notification as read
 * @route PUT /api/notifications/:notificationId/read
 * @access Private
 */
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if the user is the recipient of the notification
    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Create a notification
 * @route POST /api/notifications
 * @access Private
 */
export const createNotification = async (req, res) => {
  try {
    const { recipient, sender, type, target } = req.body;
    const notification = new Notification({
      recipient,
      sender,
      type,
      target,
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Delete a notification
 * @route DELETE /api/notifications/:notificationId
 * @access Private
 */
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if the user is the recipient of the notification
    if (notification.recipient.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await notification.remove();

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Clear all unread notifications for a user
 * @route DELETE /api/notifications/cleanup
 * @access Private
 */
export const cleanUpNotifications = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).session(session);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Merge unread notifications into notifications
    if (user.unreadNotifications.length > 0) {
      user.notifications.unshift(...user.unreadNotifications);
      user.unreadNotifications = [];
      await user.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Unread notifications cleared successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get unread notifications count by type
 * @route POST /api/notifications/unread
 * @access Private
 */
export const getUnreadNotifications = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const notifications = await Notification.aggregate([
      {
        $match: {
          _id: {
            $in: notificationIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { k: "$_id", v: "$count" } },
        },
      },
      {
        $replaceRoot: { newRoot: { $arrayToObject: "$data" } },
      },
    ]);

    res.status(200).json(notifications[0] || {});
  } catch (error) {
    console.error("Error in getUnreadNotifications:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const markTypeAsRead = async (req, res) => {
  try {
    const { notificationType } = req.body;
    const userId = req.user._id;

    await Notification.updateMany(
      { recipient: userId, type: notificationType, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error("Error in markTypeAsRead:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
