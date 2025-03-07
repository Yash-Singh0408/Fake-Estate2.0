import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/getAllUsers", getUsers);

router.get("/getUser/:id", verifyToken, getUser);

router.put("/updateUser/:id",verifyToken, updateUser);

router.delete("/deleteUser/:id",verifyToken, deleteUser); 

export default router;
