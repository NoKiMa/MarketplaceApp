import { Order, OrderRequest, OrderResponse } from '../models/Order';

export interface OrderRepository {
  createOrder(order: OrderRequest): Promise<OrderResponse>;
  getOrderById(id: string): Promise<Order | null>;
  getUserOrders(userId: string): Promise<Order[]>;
}