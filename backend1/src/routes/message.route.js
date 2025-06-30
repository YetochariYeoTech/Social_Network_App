import express from "express";
import { body } from "express-validator";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post(
  "/send/:id",
  protectRoute,
  [
    body("text").optional(),
    body("image").optional(),
  ],
  sendMessage
);

export default router;