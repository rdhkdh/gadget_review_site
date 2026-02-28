import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const authRoutes = Router();

authRoutes.post('/register', authController.register);
authRoutes.post('/login', authController.login);
authRoutes.patch('/change-password', authMiddleware, authController.changePassword);
authRoutes.delete('/account', authMiddleware, authController.deleteAccount);
