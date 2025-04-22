import express from "express";
import {
  deleteUser,
  getNotificationNumber,
//   getUser,
  profilePosts,
  savePost,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// router.get("/getUser/:id", verifyToken, getUser);
router.put("/updateUser/:id", verifyToken, updateUser);
router.delete("/deleteUser/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

export default router;
