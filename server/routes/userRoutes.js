import { signUp, signIn, refreshTokens } from "../controllers/userController.js";
import express from 'express';

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/refresh', refreshTokens);

export default router;