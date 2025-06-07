import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import userToPostRoutes from "./userToPost.route.js";
import {
  createPost,
  deletePost,
  getPosts,
} from "../controllers/post.controller.js";
import { app } from "../lib/socket.js";

const router = express.Router();

router.post("/createPost", protectRoute, createPost);

router.get("/", protectRoute, getPosts);

router.delete("/deletePost/:postId", protectRoute, deletePost);

// User and Post interactions are separated from normal CRUD actions
app.use("/actions", userToPostRoutes);

export default router;
