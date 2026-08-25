export type CategoryType =
  | 'Todos'
  | 'Suplementos'
  | 'Aceites esenciales'
  | 'Cosmética natural'
  | 'Tés e infusiones'
  | 'Cuidado personal';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategoryType | string;
  priceBs: number;
  priceUsd: number;
  image: string;
  stock: number;
  badge?: string;
  rating?: number;
  presentation?: string;
  ingredients?: string;
  benefits?: string[];
  usage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message?: string;
}