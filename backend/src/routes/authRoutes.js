import express from "express";
import { RegisterUser } from "../controllers/authController.js";
import { SignInUser } from "../controllers/authController.js";
import { GetCurrentUser } from "../controllers/authController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/signin", SignInUser);

// Order matters here, requireAuth should be placed before GetCurrentUser to ensure that the user is authenticated before accessing the current user information.
router.get("/user", requireAuth, GetCurrentUser);

export default router;