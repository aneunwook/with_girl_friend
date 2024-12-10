import { createPost, getAllPosts, updatePost, getPostById, deletePost } from "../controllers/postController.js";
import express from 'express';

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost)

export default router;