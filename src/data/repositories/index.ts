import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { OrderRepositoryImpl } from './OrderRepositoryImpl';
import { ProductRepositoryImpl } from './ProductRepositoryImpl';

// Initialize repositories
const productRepository: ProductRepository = new ProductRepositoryImpl();
const orderRepository: OrderRepository = new OrderRepositoryImpl();

// Export repositories
export const repositories = {
  productRepository,
  orderRepository,
};

// Export types
export type { OrderRepository, ProductRepository };

