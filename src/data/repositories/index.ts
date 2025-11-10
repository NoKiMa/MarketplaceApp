import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductRepositoryImpl } from './ProductRepositoryImpl';

// Initialize repositories
const productRepository: ProductRepository = new ProductRepositoryImpl();

// Export repositories
export const repositories = {
  productRepository,
};

// Export types
export type { ProductRepository };
