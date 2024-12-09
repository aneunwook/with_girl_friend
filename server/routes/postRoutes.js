import { createPost, getAllPosts } from "../controllers/postController.js";
import express from 'express';

const router = express.Router();

router.post('/posts', createPost);
router.get('/posts', getAllPosts);

export default router;