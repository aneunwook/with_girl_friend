import express from 'express';
import {
  createAnniversary,
  getAnniversariesByDateRange,
  updateAnniversary,
  deleteAnniversary,
} from '../controllers/anniversaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createAnniversary);
router.get('/', authMiddleware, getAnniversariesByDateRange);
router.put('/:id', authMiddleware, updateAnniversary);
router.delete('/:id', authMiddleware, deleteAnniversary);

export default router;
