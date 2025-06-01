import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { createPost, getPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/newpost", protectedRoute, createPost);

router.get("/posts", protectedRoute, getPosts);
