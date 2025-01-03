import express from 'express';
import { createAnniversary, getAnniversariesByDateRange, updateAnniversary,deleteAnniversary } from '../controllers/anniversaryController.js';

const router = express.Router();

router.post('/', createAnniversary);
router.get('/', getAnniversariesByDateRange);
router.put('/:id', updateAnniversary);
router.delete('/:id',deleteAnniversary);

export default router;