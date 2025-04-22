import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { deleteUser, getAllListings, getAllUsers, getDashboardStats, updatePostStatus } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", verifyAdmin, getDashboardStats);
router.get("/users", verifyAdmin, getAllUsers);
router.delete("/deleteusers/:id", verifyAdmin, deleteUser);
router.get("/getAllListings", verifyAdmin, getAllListings);
router.put("/updateStatus/:id", verifyAdmin , updatePostStatus);


export default router;