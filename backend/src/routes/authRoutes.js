import express from "express";
import {
  guestLogin,
  googleLogin,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/guest", guestLogin);
router.post("/google", googleLogin);
router.get("/me", protect, getMe);

export default router;
