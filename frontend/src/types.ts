export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Gadget {
  id: number;
  name: string;
  brandId: number;
  categoryId: number;
  model: string;
  price: number | string;
  description: string | null;
  performanceSpecs: Record<string, unknown> | null;
  imageUrl: string | null;
  averageRating: number | string;
  reviewCount: number;
  createdAt: string;
  brand?: Brand;
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: number;
  gadgetId: number;
  userId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: { id: number; name: string };
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export type SortOption = 'price_asc' | 'price_desc' | 'rating_asc' | 'rating_desc';

export interface UserReview {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  gadget: { id: number; name: string; model: string; brand: { name: string } };
}
