import express from "express";
import { body } from "express-validator";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addToFavorites,
  createComment,
  deleteComment,
  likePost,
  removeFromFavorites,
  unlikePost,
} from "../controllers/userToPost.controller.js";
import { getCommentsByPost } from "../controllers/comment.controller.js";

const router = express.Router();

// Favorites routes
router.post("/favorites/:postId", protectRoute, addToFavorites); // Not a PUT request because we are creating a new favorite item
router.delete("/favorites/:postId", protectRoute, removeFromFavorites);

// Likes routes
router.post("/likes/:postId", protectRoute, likePost);
router.delete("/likes/:postId", protectRoute, unlikePost);

// Comments routes
router.post(
  "/:postId/comments",
  protectRoute,
  [body("content").notEmpty().withMessage("Content is required")],
  createComment
);
router.get("/:postId/comments", protectRoute, getCommentsByPost);
router.delete("/comments/:commentId", protectRoute, deleteComment);

export default router;
