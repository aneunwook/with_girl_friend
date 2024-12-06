import express from 'express';
const router = express.Router();
import { createPost, getAllPosts, updatePost, deletePost, getPostById } from '../controllers/postController.js';

router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', deletePost);

export default router;
