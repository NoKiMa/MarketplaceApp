import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { OrderRepositoryImpl } from './OrderRepositoryImpl';
import { ProductRepositoryImpl } from './ProductRepositoryImpl';

const productRepository: ProductRepository = new ProductRepositoryImpl();
const orderRepository: OrderRepository = new OrderRepositoryImpl();

export const repositories = {
  productRepository,
  orderRepository,
};

export type { OrderRepository, ProductRepository };

