import { v4 as uuidv4 } from 'uuid';
import { Order, OrderResponse, CreateOrderRequest, OrderStatus } from '../../domain/models/Order';

// In-memory storage for orders
let orders: Order[] = [];

export const mockOrderApi = {
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        id: `order_${uuidv4().substring(0, 8)}`,
        userId: orderData.userId,
        items: orderData.items,
        total: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      orders.push(newOrder);
      
      return {
        success: true,
        orderId: newOrder.id,
        message: 'Order placed successfully!',
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: 'Failed to place order. Please try again.',
      };
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return orders.find(order => order.id === id) || null;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return orders.filter(order => order.userId === userId);
  },

  // For testing purposes
  _clearOrders() {
    orders = [];
  }
};