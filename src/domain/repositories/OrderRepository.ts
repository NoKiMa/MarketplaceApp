import { Order, CreateOrderRequest, OrderResponse } from '../models/Order';

export interface OrderRepository {
  createOrder(order: CreateOrderRequest): Promise<OrderResponse>;
  getOrderById(id: string): Promise<Order | null>;
  getUserOrders(userId: string): Promise<Order[]>;
}