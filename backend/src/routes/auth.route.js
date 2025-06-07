import express from "express";
import {
  addToFavorites,
  checkAuth,
  likePost,
  login,
  logout,
  removeFromFavorites,
  signup,
  unlikePost,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;
