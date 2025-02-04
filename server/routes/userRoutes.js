import { signUp, signIn, getUserProfile } from '../controllers/userController.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/profile', authMiddleware, getUserProfile);


export default router;
