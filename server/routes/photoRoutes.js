import {
  createPostWithPhotos,
  getAllPosts,
  getPostDetails,
  updatePhoto,
} from '../controllers/photoController.js';
import express from 'express';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', upload.array('photos'), createPostWithPhotos);
router.get('/allPost', getAllPosts);
router.get('/:post_id', getPostDetails);
router.put('/:id', updatePhoto);

export default router;
