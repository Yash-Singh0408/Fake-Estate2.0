import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { accessChat, addChat, getChat, getChats, readChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
router.post("/access", verifyToken, accessChat);

export default router;
