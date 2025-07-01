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
 * @desc Clear unread notifications for a user by category
 * @route DELETE /api/notifications/cleanup
 * @access Private
 */
export const cleanUpNotifications = async (req, res) => {
  try {
    const { key } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the key exists in the map and clear the array
    if (user.unreadNotifications.has(key)) {
      user.unreadNotifications.set(key, []);
      await user.save();
    }

    res
      .status(200)
      .json(`Unread notifications for '${key}' cleared`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
