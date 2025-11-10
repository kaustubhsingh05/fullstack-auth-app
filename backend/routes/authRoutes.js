import express from "express";
import { signup, login, logout, saveCard, getMyCard } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// business card endpoints (require auth)
router.post("/card", protect, saveCard);
router.get("/card", protect, getMyCard);

export default router;
