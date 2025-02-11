import {
  signIn,
  signUp,
  getUserProfile,
  sendVerificationCode,
  verifyEmailCode,
  checkEmail,
  searchUserByEmail,
  spotifyAuthCallback
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

//스포티파이 로그인
router.get('/callback', spotifyAuthCallback);

export default router;
