import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/createPost", protectRoute, createPost);

router.get("/", protectRoute, getPosts);

router.delete("/deletePost/:postId", protectRoute, deletePost);

export default router;
