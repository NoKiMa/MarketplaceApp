import { v4 as uuidv4 } from 'uuid';
import { Order, OrderRequest, OrderResponse } from '../../domain/models/Order';

// In-memory storage for orders
let orders: Order[] = [];

export const mockOrderApi = {
  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const subtotal = orderData.totalAmount;
      const shippingCost = 0;
      const tax = 0;
      const total = subtotal + shippingCost + tax;

      const newOrder: Order = {
        id: `order_${uuidv4().substring(0, 8)}`,
        userId: orderData.userId,
        items: orderData.items,
        shippingAddress: {
          firstName: orderData.shippingInfo.firstName,
          lastName: orderData.shippingInfo.lastName,
          address: orderData.shippingInfo.address,
          city: orderData.shippingInfo.city,
          postalCode: orderData.shippingInfo.postalCode,
          country: orderData.shippingInfo.country,
          email: orderData.shippingInfo.email,
        },
        subtotal,
        shippingCost,
        tax,
        total,
        status: orderData.status,
        paymentMethod: 'card',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      orders.push(newOrder);

      return {
        success: true,
        order: newOrder,
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