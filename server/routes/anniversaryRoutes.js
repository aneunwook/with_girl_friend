import express from 'express';
import { createAnniversary } from '../controllers/anniversaryController.js';

const router = express.Router();

router.post('/', createAnniversary);

export default router;