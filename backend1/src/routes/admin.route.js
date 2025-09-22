import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  getAllUsers,
  getUserById,
  lockUser,
  unlockUser,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", protectRoute, isAdmin, getAllUsers);
router.get("/users/:id", protectRoute, isAdmin, getUserById);
router.put("/users/:id/lock", protectRoute, isAdmin, lockUser);
router.put("/users/:id/unlock", protectRoute, isAdmin, unlockUser);
router.delete("/users/:id", protectRoute, isAdmin, deleteUser);

export default router;
