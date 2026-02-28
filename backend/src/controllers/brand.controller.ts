import { Request, Response } from 'express';
import * as brandService from '../services/brand.service';

export async function list(req: Request, res: Response) {
  try {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const brands = await brandService.getAllBrands(categoryId);
    return res.json(brands);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch brands' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required' });
    }
    const brand = await brandService.createBrand(name.trim());
    return res.status(201).json(brand);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to create brand' });
  }
}
