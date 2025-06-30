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
    const notifications = await Notification.find({ recipient: userId })
      .populate("sender", "username profilePicture")
      .populate("target");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
