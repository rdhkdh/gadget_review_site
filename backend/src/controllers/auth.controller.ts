import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    const result = await authService.register(name, email, password);
    return res.status(201).json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Registration failed';
    return res.status(400).json({ error: message });
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    return res.json({ message: 'Password changed successfully' });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to change password';
    return res.status(400).json({ error: message });
  }
}

export async function deleteAccount(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    await authService.deleteAccount(req.user.id);
    return res.json({ message: 'Account deleted' });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to delete account' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const result = await authService.login(email, password);
    return res.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Login failed';
    return res.status(401).json({ error: message });
  }
}
