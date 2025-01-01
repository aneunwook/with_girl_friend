import {
  createPost,
  getAllPosts,
  updatePost,
  getPostById,
  deletePost,
} from '../controllers/postController.js';
import express from 'express';

const router = express.Router();

// 모든 게시물 조회 (인증된 사용자만 가능)
router.get('/', authorizeRole('user'), getAllPosts);

//게시물 작성(관리자만)
router.post('/', authenticateToken, authorizeRole('user'), createPost);

// 특정 게시물 조회 (인증된 사용자만 가능)
router.get('/:id', authorizeRole('user'), getPostById);

// 게시물 수정 (관리자만 가능)
router.put('/:id', authorizeRole('user'), updatePost);

// 게시물 삭제 (관리자만 가능)
router.delete('/:id', authorizeRole('user'), deletePost);

export default router;
