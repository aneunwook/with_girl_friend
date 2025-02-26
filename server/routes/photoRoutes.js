import {
  createPostWithPhotos,
  getAllPosts,
  getPostDetails,
  updatePostWithPhotos,
  deletePostWithPhotos,
  uploadPhotos,
  searchPostsByTag,
} from '../controllers/photoController.js';
import express from 'express';
import upload from '../middleware/upload.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/upload',
  authMiddleware,
  upload.array('photos', 10),
  uploadPhotos
);
router.post('/photo', authMiddleware, createPostWithPhotos);
router.get('/allPost', authMiddleware, getAllPosts);
router.get('/:id', authMiddleware, getPostDetails);
router.put(
  '/:id',
  authMiddleware,
  (req, res, next) => {
    // 클라이언트에서 기존 사진 개수를 함께 보내도록 함
    const existingPhotosCount = req.body.existingPhotos
      ? req.body.existingPhotos.length
      : 0;
    const maxPhotos = 10; // 최대 10개

    // Multer 미들웨어 적용 전, 현재 추가할 수 있는 파일 개수를 계산
    const uploadLimit = maxPhotos - existingPhotosCount;
    if (uploadLimit <= 0) {
      return res
        .status(400)
        .json({ message: '최대 10개의 이미지만 업로드할 수 있습니다.' });
    }

    // Multer 설정을 동적으로 변경
    const dynamicUpload = upload.array('photos', uploadLimit);
    dynamicUpload(req, res, next);
  },
  updatePostWithPhotos
);

router.delete('/:id', authMiddleware, deletePostWithPhotos);
// API 요청 로그 추가
// router.get('/whatSearch', authMiddleware, searchPostsByTag);

export default router;
