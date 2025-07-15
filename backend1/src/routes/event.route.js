import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import checkRole from "../middleware/role.middleware.js";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpToEvent,
} from "../controllers/event.controller.js";

const router = express.Router();

router.get("/", protectRoute, getEvents);
router.get("/:eventId", protectRoute, getEventById);

router.post("/", protectRoute, checkRole(["STAFF", "ADMIN"]), createEvent);
router.put("/:eventId", protectRoute, checkRole(["STAFF", "ADMIN"]), updateEvent);
router.delete("/:eventId", protectRoute, checkRole(["STAFF", "ADMIN"]), deleteEvent);
router.post("/:eventId/rsvp", protectRoute, rsvpToEvent);

export default router;
