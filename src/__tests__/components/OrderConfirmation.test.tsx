import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import OrderConfirmation from '../../presentation/components/OrderConfirmation';
import orderReducer, { clearOrder } from '../../presentation/store/slices/orderSlice';

// Mock expo-router navigation + params
const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ orderId: 'route-123' }),
  useNavigation: () => ({ navigate: mockNavigate, setOptions: mockSetOptions }),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const makeOrder = (overrides: Partial<any> = {}) => ({
  id: overrides.id ?? 'ord-1',
  userId: overrides.userId ?? 'user_123',
  items: overrides.items ?? [
    { productId: 'p1', name: 'Phone', price: 100, quantity: 2 },
    { productId: 'p2', name: 'Case', price: 20, quantity: 1 },
  ],
  shippingAddress: overrides.shippingAddress ?? {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main St',
    city: 'Anytown',
    postalCode: '12345',
    country: 'United States',
    email: 'john.doe@example.com',
  },
  subtotal: overrides.subtotal ?? 220,
  shippingCost: overrides.shippingCost ?? 0,
  tax: overrides.tax ?? 0,
  total: overrides.total ?? 220,
  status: overrides.status ?? 'processing',
  paymentMethod: overrides.paymentMethod ?? 'card',
  paymentStatus: overrides.paymentStatus ?? 'paid',
  createdAt: overrides.createdAt ?? new Date().toISOString(),
  updatedAt: overrides.updatedAt ?? new Date().toISOString(),
});

const renderWithStore = (currentOrder: any | null) => {
  const store = configureStore({
    reducer: { order: orderReducer },
    preloadedState: {
      order: {
        orders: currentOrder ? [currentOrder] : [],
        currentOrder,
        loading: false,
        error: null,
      },
    },
  });
  const utils = render(
    <Provider store={store}>
      <OrderConfirmation />
    </Provider>
  );
  return { store, ...utils };
};

describe('OrderConfirmation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot (order present with fixed dates)', async () => {
  const fixedDate = '2024-01-01T00:00:00.000Z';
  const order = makeOrder({ createdAt: fixedDate, updatedAt: fixedDate });

  const { toJSON } = renderWithStore(order);

  await waitFor(() => expect(screen.getByText('Order Confirmed!')).toBeTruthy());

  expect(toJSON()).toMatchSnapshot();
});

  it('renders order info using currentOrder and route param orderId', async () => {
    const order = makeOrder({ id: 'ord-999', total: 150 });
    renderWithStore(order);

    // Basic title and order info present
    await waitFor(() => expect(screen.getByText('Order Confirmed!')).toBeTruthy());

    // Order number shows route param if present or currentOrder id
    expect(screen.getByText(/#(route-123|ord-999)/)).toBeTruthy();

    // Total formatted
    expect(screen.getByText(`$${order.total.toFixed(2)}`)).toBeTruthy();

    // Status badge uses uppercase of currentOrder.status
    expect(screen.getByText(order.status.toUpperCase())).toBeTruthy();

    // Items listed
    expect(screen.getByText('Phone')).toBeTruthy();
    expect(screen.getByText('Case')).toBeTruthy();
  });

  it('handles Continue Shopping: clears order and navigates', async () => {
    const order = makeOrder();
    const { store } = renderWithStore(order);

    await waitFor(() => expect(screen.getByText('Order Confirmed!')).toBeTruthy());

    fireEvent.press(screen.getByText('Continue Shopping'));

    // clearOrder should be dispatched
    const actions = store.getState().order.currentOrder;
    expect(actions).toBeNull();

    // navigates to ProductList
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('handles View Orders: clears order and shows alert', async () => {
    const order = makeOrder();
    const { store } = renderWithStore(order);

    await waitFor(() => expect(screen.getByText('Order Confirmed!')).toBeTruthy());

    fireEvent.press(screen.getByText('View Orders'));

    // Order cleared
    expect(store.getState().order.currentOrder).toBeNull();

    // Alert invoked
    expect(Alert.alert).toHaveBeenCalled();
  });

  it('renders without items gracefully', async () => {
    const order = makeOrder({ items: [] });
    renderWithStore(order);

    await waitFor(() => expect(screen.getByText('Order Confirmed!')).toBeTruthy());

    // Shows 'No items' block when no items present
    expect(screen.getByText('No items')).toBeTruthy();
  });
});