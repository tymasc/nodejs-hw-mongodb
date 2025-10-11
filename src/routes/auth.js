import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  requsetPasswordSchema,
} from '../../validation/auth.js';
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
  requestPasswordResetController,
  resetPasswordController,
} from '../controllers/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), registerUserController);
router.post('/login', validateBody(loginSchema), loginUserController);
router.post('/logout', logoutUserController);
router.post('/refresh', refreshSessionController);
router.post(
  '/send-reset-email',
  upload.none(),
  validateBody(requsetPasswordSchema),
  requestPasswordResetController,
);
router.post(
  '/reset-pwd',
  upload.none(),
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

export default router;
