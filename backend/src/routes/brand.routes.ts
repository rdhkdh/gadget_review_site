import { Router } from 'express';
import * as brandController from '../controllers/brand.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const brandRoutes = Router();

brandRoutes.get('/', brandController.list);
brandRoutes.post('/', authMiddleware, brandController.create);
