import express from "express";
import { RegisterUser } from "../controllers/authController.js";
import { SignInUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", RegisterUser);
router.post("/signin", SignInUser);

export default router;