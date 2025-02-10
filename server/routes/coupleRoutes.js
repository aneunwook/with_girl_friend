import express from 'express';
import {registerCouple} from '../controllers/coupleController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authMiddleware, registerCouple);

export default router;