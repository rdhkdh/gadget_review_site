import { Router } from 'express';
import * as gadgetController from '../controllers/gadget.controller';

export const gadgetRoutes = Router();

gadgetRoutes.get('/', gadgetController.list);
gadgetRoutes.get('/:id', gadgetController.getById);
gadgetRoutes.post('/', gadgetController.create);
gadgetRoutes.patch('/:id', gadgetController.update);
gadgetRoutes.delete('/:id', gadgetController.remove);
