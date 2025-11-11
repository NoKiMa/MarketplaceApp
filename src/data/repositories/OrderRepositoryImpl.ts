import { Order, CreateOrderRequest, OrderResponse } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { mockOrderApi } from '../api/mockOrderApi';

export class OrderRepositoryImpl implements OrderRepository {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
  try {
    return await mockOrderApi.createOrder(orderData);
  } catch (error) {
    console.error('OrderRepositoryImpl.createOrder failed:', error);
    return {
      success: false,
      error: 'Failed to place order. Please try again.',
    };
  }
}

  async getOrderById(id: string) {
    return mockOrderApi.getOrderById(id);
  }

  async getUserOrders(userId: string) {
    return mockOrderApi.getUserOrders(userId);
  }
}