import {
  createPostWithPhotos,
  // getAllPosts,
  getPostDetails,
  updatePostWithPhotos,
  deletePostWithPhotos
} from '../controllers/photoController.js';
import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', upload.array('photos'), createPostWithPhotos);
// router.get('/allPost', getAllPosts);
router.get('/:id', getPostDetails);
router.put('/:id', upload.array('photos'), updatePostWithPhotos);
router.delete('/:id', deletePostWithPhotos);

export default router;
