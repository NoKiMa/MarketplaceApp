import { Order, CreateOrderRequest, OrderResponse } from '../../domain/models/Order';
import { OrderRepository } from '../../domain/repositories/OrderRepository';
import { mockOrderApi } from '../api/mockOrderApi';

export class OrderRepositoryImpl implements OrderRepository {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    return mockOrderApi.createOrder(orderData);
  }

  async getOrderById(id: string) {
    return mockOrderApi.getOrderById(id);
  }

  async getUserOrders(userId: string) {
    return mockOrderApi.getUserOrders(userId);
  }
}