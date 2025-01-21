import {
  createPostWithPhotos,
  getAllPosts,
  getPostDetails,
  updatePostWithPhotos,
  deletePostWithPhotos,
  uploadPhotos
} from '../controllers/photoController.js';
import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', upload.array('photos'), uploadPhotos);
router.post('/photo', createPostWithPhotos);
router.get('/allPost', getAllPosts);
router.get('/:id', getPostDetails);
router.put('/:id', upload.array('photos'), updatePostWithPhotos);
router.delete('/:id', deletePostWithPhotos);

export default router;
