import orderReducer, {
  fetchOrderStart,
  fetchOrderSuccess,
  fetchOrderFailure,
  clearOrder,
  setCurrentOrder,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
  selectOrders,
} from '../../../src/presentation/store/slices/orderSlice';
import { Order, OrderRequest } from '../../../src/domain/models/Order';

describe('order slice', () => {
  const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null as string | null,
  };

  const baseOrder: Order = {
    id: 'order-1',
    userId: 'user-1',
    items: [
      {
        productId: 'p1',
        name: 'Product 1',
        quantity: 2,
        price: 100,
        image: 'image1.jpg',
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'NYC',
      postalCode: '10001',
      country: 'US',
      email: 'john@example.com',
    },
    subtotal: 200,
    shippingCost: 10,
    tax: 20,
    total: 230,
    status: 'pending',
    paymentMethod: 'card',
    paymentStatus: 'pending',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    trackingNumber: 'TRK123',
    notes: 'Leave at door',
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('fetchOrderStart should set loading true and clear error', () => {
      const prev = { ...initialState, error: 'Prev error' };
      const req: OrderRequest = {
        userId: 'user-1',
        items: baseOrder.items,
        shippingInfo: baseOrder.shippingAddress,
        totalAmount: baseOrder.total,
        status: 'pending',
      };
      const state = orderReducer(prev, fetchOrderStart(req));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.currentOrder).toBeNull();
      expect(state.orders).toEqual([]);
    });

    it('fetchOrderSuccess should set currentOrder, push to orders and stop loading', () => {
      const prev = { ...initialState, loading: true };
      const state = orderReducer(prev, fetchOrderSuccess(baseOrder));

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(baseOrder);
      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]).toEqual(baseOrder);
    });

    it('fetchOrderFailure should set error and stop loading', () => {
      const prev = { ...initialState, loading: true };
      const state = orderReducer(prev, fetchOrderFailure('Network error'));

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
      expect(state.currentOrder).toBeNull();
    });

    it('clearOrder should reset currentOrder, loading, and error', () => {
      const prev = {
        orders: [baseOrder],
        currentOrder: baseOrder,
        loading: true,
        error: 'Some error',
      };
      const state = orderReducer(prev, clearOrder());

      expect(state.currentOrder).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      // список заказов не должен очищаться
      expect(state.orders).toEqual([baseOrder]);
    });

    it('setCurrentOrder should set the provided order as current', () => {
      const anotherOrder: Order = {
        ...baseOrder,
        id: 'order-2',
        total: 99,
        updatedAt: '2024-01-02T00:00:00.000Z',
        status: 'processing',
      };
      const state = orderReducer(initialState, setCurrentOrder(anotherOrder));

      expect(state.currentOrder).toEqual(anotherOrder);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('selectors', () => {
    const populatedState = {
      order: {
        orders: [baseOrder],
        currentOrder: baseOrder,
        loading: false,
        error: null as string | null,
      },
    };

    it('selectCurrentOrder should return current order', () => {
      expect(selectCurrentOrder(populatedState as any)).toEqual(baseOrder);
    });

    it('selectOrderLoading should return loading flag', () => {
      expect(selectOrderLoading(populatedState as any)).toBe(false);
    });

    it('selectOrderError should return error', () => {
      expect(selectOrderError(populatedState as any)).toBeNull();
    });

    it('selectOrders should return orders list', () => {
      expect(selectOrders(populatedState as any)).toEqual([baseOrder]);
    });
  });
});
