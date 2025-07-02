import express from "express";
import { body } from "express-validator";
import { protectRoute } from "../middleware/auth.middleware.js";
import userToPostRoutes from "./userToPost.route.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectRoute, getPosts);

router.post(
  "/createPost",
  protectRoute,
  [
    body("description").optional(),
    body("attachment").optional(),
    body("attachmentType").optional(),
    body("originalFileName").optional(),
  ],
  createPost
);

router.delete("/deletePost/:postId", protectRoute, deletePost);
// ✅ Correct usage: Nest userToPostRoutes under /actions
router.use("/actions", userToPostRoutes);

export default router;
