import express from "express";
import { SearchUsers } from "../controllers/userController.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", requireAuth, SearchUsers);

export default router;