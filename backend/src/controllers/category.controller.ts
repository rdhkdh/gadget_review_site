import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export async function list(_req: Request, res: Response) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch categories' });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const category = await categoryService.getCategoryById(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    return res.json(category);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch category' });
  }
}
