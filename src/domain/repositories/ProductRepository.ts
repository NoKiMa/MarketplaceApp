import { Product, ProductFilter } from '../models/Product';
import { BaseRepository } from './BaseRepository';

export interface ProductRepository extends BaseRepository<Product> {
  getCategories(): Promise<string[]>;
  searchProducts(filter: ProductFilter): Promise<Product[]>;
  getFeaturedProducts(limit: number): Promise<Product[]>;
}
