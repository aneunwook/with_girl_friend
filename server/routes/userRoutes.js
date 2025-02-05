import {
  signUp,
  signIn,
  getUserProfile,
  verifyEmailCode,
  sendVerificationEmail,
} from '../controllers/userController.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sendEmailVerification', sendVerificationEmail); // 이메일 인증 코드 발송
router.post('/verifyEmailCode', verifyEmailCode); // 이메일 인증 코드 확인
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/profile', authMiddleware, getUserProfile);

export default router;
