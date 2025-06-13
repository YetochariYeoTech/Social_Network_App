import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addToFavorites,
  likePost,
  removeFromFavorites,
  unlikePost,
} from "../controllers/userToPost.controller.js";

const router = express.Router();

// Favorites routes
router.post("/favorites/:postId", protectRoute, addToFavorites); // Not a PUT request because we are creating a new favorite item
router.delete("/favorites/:postId", protectRoute, removeFromFavorites);

// Likes routes
router.post("/likes/:postId", protectRoute, likePost);
router.delete("/likes/:postId", protectRoute, unlikePost);

// Comments routes

export default router;
