import type { Product } from './types';

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  category: string;
  priceBs: number;
  priceUsd: number;
  image: string;
  stock: number;
  badge: string | null;
  rating: number | null;
  presentation: string | null;
  ingredients: string | null;
  benefits: string | null;
  usage: string | null;
  createdAt: string;
  updatedAt: string;
}

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    priceBs: row.priceBs,
    priceUsd: row.priceUsd,
    image: row.image,
    stock: row.stock,
    badge: row.badge ?? undefined,
    rating: row.rating ?? undefined,
    presentation: row.presentation ?? undefined,
    ingredients: row.ingredients ?? undefined,
    benefits: row.benefits ? row.benefits.split('|') : undefined,
    usage: row.usage ?? undefined,
  };
}