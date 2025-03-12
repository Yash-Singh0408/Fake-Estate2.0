import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getPosts, getPost, addPost, updatePost, deletePost } from "../controllers/post.controller.js";


const router = express.Router();


router.get('/getAllPosts/', getPosts);
router.get('/getPost/:id', getPost);
router.post('/addPost/',verifyToken, addPost);
router.put('/updatePost/:id', verifyToken, updatePost);
router.delete('/deletePost/:id', verifyToken, deletePost);

export default router;
