export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type SortOrder = 'asc' | 'desc';

export interface ProductFilter {
  searchQuery: string;
  category: string | null;
  sortBy: 'price' | 'rating' | 'name';
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export const DEFAULT_PAGE_SIZE = 10;

export const INITIAL_FILTER: ProductFilter = {
  searchQuery: '',
  category: null,
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 10,
};