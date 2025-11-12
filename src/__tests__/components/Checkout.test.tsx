import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react-native';
import {Alert, Text} from 'react-native';
import Checkout from '../../presentation/components/Checkout';
import cartReducer from '../../presentation/store/slices/cartSlice';
import orderReducer, {
  fetchOrderSuccess,
} from '../../presentation/store/slices/orderSlice';
import * as OrderSlice from '../../presentation/store/slices/orderSlice';
import {act} from '@testing-library/react-native';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({navigate: mockNavigate}),
}));

// Spy on Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

type Item = {
  id: string;
  name: string;
  images: string[];
  price: number;
  rating: number;
  stock: number;
  category: string;
  description: string;
  quantity: number;
};

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: overrides.id ?? 'p1',
  name: overrides.name ?? 'Phone',
  images: overrides.images ?? ['https://example.com/img.jpg'],
  price: overrides.price ?? 100,
  rating: overrides.rating ?? 4.5,
  stock: overrides.stock ?? 10,
  category: overrides.category ?? 'phones',
  description: overrides.description ?? 'desc',
  quantity: overrides.quantity ?? 2,
});

const renderWithStore = (cartItems: Item[] = []) => {
  const store = configureStore({
    reducer: {cart: cartReducer, order: orderReducer},
    preloadedState: {
      cart: {items: cartItems},
      order: {orders: [], currentOrder: null, loading: false, error: null},
    },
  });
  const utils = render(
    <Provider store={store}>
      {/* Wrapper to avoid ScrollView warning text-only */}
      <Checkout />
      {/* Prevent potential RN warnings about missing Text ancestor */}
      <Text />
    </Provider>,
  );
  return {store, ...utils};
};

describe('Checkout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot (empty cart)', async () => {
    const {toJSON} = renderWithStore([]);

    await waitFor(() =>
      expect(screen.getByText('Your cart is empty')).toBeTruthy(),
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot (cart with items)', async () => {
    const items = [
      makeItem({id: 'p1', name: 'Phone', price: 100, quantity: 2}),
    ];
    const {toJSON} = renderWithStore(items);

    await waitFor(() => expect(screen.getByText('Total:')).toBeTruthy());

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders empty cart message', async () => {
    renderWithStore([]);

    await waitFor(() =>
      expect(screen.getByText('Your cart is empty')).toBeTruthy(),
    );
  });

  it('validates fields and shows error alerts', async () => {
    // Start with empty form, ensure required validation triggers
    const item = makeItem();
    renderWithStore([item]);

    const firstName = await screen.findByPlaceholderText('First Name');
    fireEvent.changeText(firstName, '');

    const placeOrder = screen.getByText(/Place Order/);
    fireEvent.press(placeOrder);

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Please fill in all required fields',
      ),
    );

    // Now fill all required fields except make email invalid to trigger email validation
    (Alert.alert as jest.Mock).mockClear();
    fireEvent.changeText(firstName, 'John');
    const lastName = screen.getByPlaceholderText('Last Name');
    const address = screen.getByPlaceholderText('Address');
    const city = screen.getByPlaceholderText('City');
    const postalCode = screen.getByPlaceholderText('Postal Code');
    const email = screen.getByPlaceholderText('Email');

    fireEvent.changeText(lastName, 'Doe');
    fireEvent.changeText(address, '123 Main St');
    fireEvent.changeText(city, 'Anytown');
    fireEvent.changeText(postalCode, '12345');
    fireEvent.changeText(email, 'invalid-email');

    fireEvent.press(placeOrder);

    await waitFor(() =>
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        'Please enter a valid email address',
      ),
    );
  });

  it('dispatches fetchOrderStart with correct payload and navigates on success (clears cart)', async () => {
    const items = [
      makeItem({id: 'p1', name: 'Phone', price: 100, quantity: 2}),
    ];
    const {store} = renderWithStore(items);

    await waitFor(() => expect(screen.getByText('Total:')).toBeTruthy());

    // Fill required fields with valid values
    fireEvent.changeText(screen.getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(screen.getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.changeText(
      screen.getByPlaceholderText('Email'),
      'john.doe@example.com',
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Address'),
      '123 Main St',
    );
    fireEvent.changeText(screen.getByPlaceholderText('City'), 'Anytown');
    fireEvent.changeText(
      screen.getByPlaceholderText('Postal Code'),
      '12345',
    );

    const fetchStartSpy = jest.spyOn(OrderSlice, 'fetchOrderStart');
    const placeOrder = screen.getByText(/Place Order/);

    fireEvent.press(placeOrder);

    await waitFor(() => {
      expect(fetchStartSpy).toHaveBeenCalled();
      const payload = fetchStartSpy.mock.calls[0][0] as any;
      expect(payload).toMatchObject({
        userId: 'user_123',
        totalAmount: 200,
        status: 'processing',
      });
      expect(payload.items).toEqual([
        {productId: 'p1', name: 'Phone', price: 100, quantity: 2},
      ]);
    });

    await act(async () => {
      store.dispatch(
        fetchOrderSuccess({
          id: 'ord-1',
          userId: 'user_123',
          items: [{productId: 'p1', name: 'Phone', price: 100, quantity: 2}],
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'Anytown',
            postalCode: '12345',
            country: 'United States',
            email: 'john.doe@example.com',
          },
          subtotal: 200,
          shippingCost: 0,
          tax: 0,
          total: 200,
          status: 'processing',
          paymentMethod: 'card',
          paymentStatus: 'paid',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      );
    });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
});