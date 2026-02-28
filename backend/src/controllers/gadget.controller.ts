import { Request, Response } from 'express';
import * as gadgetService from '../services/gadget.service';

export async function list(req: Request, res: Response) {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const brandId = req.query.brandId ? Number(req.query.brandId) : undefined;
    const minRating = req.query.minRating != null ? Number(req.query.minRating) : undefined;
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy as gadgetService.GadgetFilters['sortBy'] : undefined;
    const gadgets = await gadgetService.getGadgets({ categoryId, brandId, minRating, search, sortBy });
    return res.json(gadgets);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch gadgets' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const gadget = await gadgetService.getGadgetById(id);
    if (!gadget) return res.status(404).json({ error: 'Gadget not found' });
    return res.json(gadget);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch gadget' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const gadget = await gadgetService.createGadget(req.body);
    return res.status(201).json(gadget);
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Failed to create gadget' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const gadget = await gadgetService.updateGadget(id, req.body);
    return res.json(gadget);
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Failed to update gadget' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    await gadgetService.deleteGadget(id);
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to delete gadget' });
  }
}
