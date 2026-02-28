import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as reviewController from '../controllers/review.controller';

export const reviewRoutes = Router();

reviewRoutes.get('/user/me', authMiddleware, reviewController.listByUser);
reviewRoutes.get('/gadget/:gadgetId', reviewController.listByGadget);
reviewRoutes.post('/gadget/:gadgetId', authMiddleware, reviewController.create);
reviewRoutes.patch('/:id', authMiddleware, reviewController.update);
reviewRoutes.delete('/:id', authMiddleware, reviewController.remove);
