import express from "express";
import {
  deleteUser,
  getNotificationNumber,
  getUser,
  isPostSaved,
  profilePosts,
  savePost,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/getUser/:id", getUser);
router.put("/updateUser/:id", verifyToken, updateUser);
router.delete("/deleteUser/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);
router.get("/saved/:id",verifyToken, isPostSaved);

export default router;
