import {
  signIn,
  signUp,
  getUserProfile,
  sendVerificationCode,
  verifyEmailCode,
  checkEmail,
  searchUserByEmail
} from '../controllers/userController.js';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sendEmailVerification', sendVerificationCode); // 이메일 인증 코드 발송
router.post('/verifyEmailCode', verifyEmailCode); // 이메일 인증 코드 확인
router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.get('/profile', authMiddleware, getUserProfile);
router.post('/search', searchUserByEmail);

//이메일 중복 확인
router.post('/check-email', checkEmail);

export default router;
