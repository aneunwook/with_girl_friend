import { signUp, signIn } from "../controllers/userController.js";
import express from 'express';

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);

export default router;