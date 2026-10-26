import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
    StartDirectConversation,
    ListMyConversations,
    GetConversation,
} from "../controllers/conversationController.js"

const router = express.Router();

router.post("/", requireAuth, StartDirectConversation);
router.get("/", requireAuth, ListMyConversations);
// GET /:conversationId fetches one conversation. The controller reads the ID from req.params.conversationId.
router.get("/:conversationId", requireAuth, GetConversation);

export default router;
