import {
  createPostWithPhotos,
  getAllPosts,
  getPostDetails,
  updatePostWithPhotos,
  deletePostWithPhotos,
  uploadPhotos,
  searchPostsByTag
} from '../controllers/photoController.js';
import express from 'express';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/upload', authMiddleware, upload.array('photos'), uploadPhotos);
router.post('/photo', authMiddleware, createPostWithPhotos);
router.get('/allPost', getAllPosts);
router.get('/:id', authMiddleware, getPostDetails);
router.put('/:id', authMiddleware, upload.array('photos'), updatePostWithPhotos);
router.delete('/:id', authMiddleware, deletePostWithPhotos);
router.get('/search', searchPostsByTag);

export default router;
