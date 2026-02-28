import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { gadgetRoutes } from './routes/gadget.routes';
import { reviewRoutes } from './routes/review.routes';
import { authRoutes } from './routes/auth.routes';
import { categoryRoutes } from './routes/category.routes';
import { brandRoutes } from './routes/brand.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/gadgets', gadgetRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
