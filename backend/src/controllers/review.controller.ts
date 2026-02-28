import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as reviewService from '../services/review.service';

export async function listByUser(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const reviews = await reviewService.getReviewsByUser(req.user.id);
    return res.json(reviews);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch reviews' });
  }
}

export async function listByGadget(req: AuthRequest, res: Response) {
  try {
    const gadgetId = Number(req.params.gadgetId);
    const reviews = await reviewService.getReviewsByGadget(gadgetId);
    return res.json(reviews);
  } catch (e) {
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to fetch reviews' });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const gadgetId = Number(req.params.gadgetId);
    const { rating, comment } = req.body;
    if (rating == null) return res.status(400).json({ error: 'Rating is required' });
    const review = await reviewService.createReview(gadgetId, req.user.id, rating, comment);
    return res.status(201).json(review);
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Failed to create review' });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const id = Number(req.params.id);
    const { rating, comment } = req.body;
    const review = await reviewService.updateReview(id, req.user.id, rating, comment);
    return res.json(review);
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Failed to update review' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const id = Number(req.params.id);
    await reviewService.deleteReview(id, req.user.id);
    return res.status(204).send();
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Failed to delete review' });
  }
}
