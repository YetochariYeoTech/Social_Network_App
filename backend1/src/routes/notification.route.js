import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
  cleanUpNotifications,
  getUnreadNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.post("/unread", protectRoute, getUnreadNotifications);
router.post("/", protectRoute, createNotification);
router.delete("/cleanup", protectRoute, cleanUpNotifications);
router.put("/:notificationId/read", protectRoute, markAsRead);
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;
