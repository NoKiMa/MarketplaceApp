import { OrderRepositoryImpl } from '../../data/repositories/OrderRepositoryImpl';
import { mockOrderApi } from '../../data/api/mockOrderApi';

// Mock the mockOrderApi
jest.mock('../../data/api/mockOrderApi');

describe('OrderRepositoryImpl', () => {
  let orderRepository: OrderRepositoryImpl;
  
  // Reset mocks before each test
 beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  orderRepository = new OrderRepositoryImpl();
});


  describe('createOrder', () => {
    it('should create an order and return success response', async () => {
      const mockOrderData = {
        userId: 'user123',
        items: [
          { productId: 'prod1', quantity: 2, price: 10 },
          { productId: 'prod2', quantity: 1, price: 20 }
        ],
        shippingAddress: '123 Test St',
        paymentMethod: 'credit_card'
      };

      const mockResponse = {
        success: true,
        orderId: 'order_abc123',
        message: 'Order placed successfully!'
      };

      (mockOrderApi.createOrder as jest.Mock).mockResolvedValue(mockResponse);

      const result = await orderRepository.createOrder(mockOrderData);

      expect(mockOrderApi.createOrder).toHaveBeenCalledWith(mockOrderData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating an order', async () => {
      const mockOrderData = {
        userId: 'user123',
        items: [],
        shippingAddress: '123 Test St',
        paymentMethod: 'credit_card'
      };

      const errorResponse = {
        success: false,
        error: 'Failed to place order. Please try again.'
      };

      (mockOrderApi.createOrder as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      const result = await orderRepository.createOrder(mockOrderData);
      
      expect(mockOrderApi.createOrder).toHaveBeenCalledWith(mockOrderData);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getOrderById', () => {
    it('should return order by id', async () => {
      const mockOrder = {
        id: 'order_abc123',
        userId: 'user123',
        items: [{ productId: 'prod1', quantity: 1, price: 10 }],
        total: 10,
        status: 'pending',
        shippingAddress: '123 Test St',
        paymentMethod: 'credit_card',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      };

      (mockOrderApi.getOrderById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderRepository.getOrderById('order_abc123');

      expect(mockOrderApi.getOrderById).toHaveBeenCalledWith('order_abc123');
      expect(result).toEqual(mockOrder);
    });

    it('should return null if order not found', async () => {
      (mockOrderApi.getOrderById as jest.Mock).mockResolvedValue(null);

      const result = await orderRepository.getOrderById('non-existent-id');

      expect(mockOrderApi.getOrderById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getUserOrders', () => {
    it('should return user orders', async () => {
      const mockOrders = [
        {
          id: 'order1',
          userId: 'user123',
          items: [],
          total: 0,
          status: 'pending',
          shippingAddress: '123 Test St',
          paymentMethod: 'credit_card',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z'
        }
      ];

      (mockOrderApi.getUserOrders as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderRepository.getUserOrders('user123');

      expect(mockOrderApi.getUserOrders).toHaveBeenCalledWith('user123');
      expect(result).toEqual(mockOrders);
    });

    it('should return empty array if no orders found', async () => {
      (mockOrderApi.getUserOrders as jest.Mock).mockResolvedValue([]);

      const result = await orderRepository.getUserOrders('user456');

      expect(mockOrderApi.getUserOrders).toHaveBeenCalledWith('user456');
      expect(result).toEqual([]);
    });
  });
});