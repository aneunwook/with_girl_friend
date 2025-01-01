import {
  createPost,
  getAllPosts,
  updatePost,
  getPostById,
  deletePost,
} from '../controllers/postController.js';
import express from 'express';

const router = express.Router();

router.get('/', getAllPosts);

router.post('/', createPost);

router.get('/:id', getPostById);

router.put('/:id', updatePost);

router.delete('/:id', deletePost);

export default router;
