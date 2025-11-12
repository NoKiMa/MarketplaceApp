import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react-native';
import Cart from '../../presentation/components/Cart';
import cartReducer from '../../presentation/store/slices/cartSlice';
import { Text } from 'react-native';

// Add at top of src/__tests__/components/Cart.test.tsx
jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const React = require('react');
  const RN = jest.requireActual('react-native');

  const FlatList = ({ data, renderItem, ListFooterComponent }) => {
    const children = (data || []).map((item, index) => {
      const el = renderItem({ item, index });
      return React.isValidElement(el)
        ? React.cloneElement(el, { key: el.key ?? String(index) })
        : el;
    });

    const footer =
      typeof ListFooterComponent === 'function'
        ? ListFooterComponent({})
        : ListFooterComponent ?? null;

    return React.createElement(
      RN.View,
      { testID: 'flatlist' },
      ...children,
      footer
    );
  };

  return { default: FlatList };
});

jest.mock('../../presentation/components/CartItem', () => {
  const React = require('react');
  const RN = require('react-native');
  const mockText = RN.Text;

  const CartItem = ({item, onIncrease, onDecrease, onRemove}) => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(mockText, null, item.name),
      React.createElement(mockText, null, item.price.toFixed(2)),
      React.createElement(mockText, null, String(item.quantity)),
      React.createElement(mockText, null, String(item.stock)),
      React.createElement(
        mockText,
        {testID: `inc-${item.id}`, onPress: () => onIncrease(item.id)},
        'INC',
      ),
      React.createElement(
        mockText,
        {testID: `dec-${item.id}`, onPress: () => onDecrease(item.id)},
        'DEC',
      ),
      React.createElement(
        mockText,
        {testID: `rm-${item.id}`, onPress: () => onRemove(item.id)},
        'RM',
      ),
    );
  };

  return {CartItem};
});

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({navigate: mockNavigate}),
}));

// Mock vector icons to avoid expo-font ESM issues
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock CartItem to expose simple test buttons instead of icon-only touchables
jest.mock('../../presentation/components/CartItem', () => {
  const React = require('react');
  const RN = require('react-native');
  const mockText = RN.Text;

  const CartItem = ({item, onIncrease, onDecrease, onRemove}) => {
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(mockText, null, item.name),
      React.createElement(mockText, null, item.price.toFixed(2)),
      React.createElement(mockText, null, String(item.quantity)),
      React.createElement(mockText, null, String(item.stock)),
      React.createElement(
        mockText,
        {testID: `inc-${item.id}`, onPress: () => onIncrease(item.id)},
        'INC',
      ),
      React.createElement(
        mockText,
        {testID: `dec-${item.id}`, onPress: () => onDecrease(item.id)},
        'DEC',
      ),
      React.createElement(
        mockText,
        {testID: `rm-${item.id}`, onPress: () => onRemove(item.id)},
        'RM',
      ),
    );
  };

  return {CartItem};
});

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  brand: string;
  rating: number;
  category: string;
  stock: number;
  quantity: number; // cart item quantity
};

const makeItem = (overrides: Partial<Product> = {}): Product => ({
  id: overrides.id ?? 'p1',
  name: overrides.name ?? 'Phone',
  description: overrides.description ?? 'desc',
  price: overrides.price ?? 100,
  images: overrides.images ?? ['https://example.com/img.jpg'],
  brand: overrides.brand ?? 'Brand',
  rating: overrides.rating ?? 4.5,
  category: overrides.category ?? 'phones',
  stock: overrides.stock ?? 10,
  quantity: overrides.quantity ?? 1,
});

const renderWithStore = (items: Product[] = []) => {
  const store = configureStore({
    reducer: {cart: cartReducer},
    preloadedState: {cart: {items}},
  });
  const utils = render(
    <Provider store={store}>
      <Cart />
      <Text />
    </Provider>,
  );
  return {store, ...utils};
};

describe('Cart', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('matches snapshot (empty cart)', async () => {
    const {toJSON} = renderWithStore([]);

    await act(async () => {
      jest.advanceTimersByTime(500); // пропустить экран загрузки
    });

    await waitFor(() =>
      expect(screen.getByText('Your cart is empty')).toBeTruthy(),
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot (with items)', async () => {
    const items = [
      makeItem({id: 'a', name: 'Item A', price: 50, quantity: 2, stock: 5}),
      makeItem({id: 'b', name: 'Item B', price: 30, quantity: 1, stock: 3}),
    ];
    const {toJSON} = renderWithStore(items);

    await act(async () => {
      jest.advanceTimersByTime(500); // пропустить экран загрузки
    });

    await waitFor(() => {
      expect(screen.getByText('Item A')).toBeTruthy();
      expect(screen.getByText('Item B')).toBeTruthy();
    });

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders empty state after loading and navigates on Continue Shopping', async () => {
    renderWithStore([]);

    // Simulate loading timeout (500ms)
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() =>
      expect(screen.getByText('Your cart is empty')).toBeTruthy(),
    );

    fireEvent.press(screen.getByText('Continue Shopping'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('renders items, totals, and navigates to checkout', async () => {
    const items = [
      makeItem({id: 'a', name: 'Item A', price: 50, quantity: 2, stock: 5}),
      makeItem({id: 'b', name: 'Item B', price: 30, quantity: 1, stock: 3}),
    ];
    const subtotal = 50 * 2 + 30 * 1; // 130
    const tax = subtotal * 0.1; // 13
    const total = subtotal + tax; // 143

    renderWithStore(items);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByText('Item A')).toBeTruthy();
      expect(screen.getByText('Item B')).toBeTruthy();
    });

    // Check summary values
    expect(screen.getByText(`$${subtotal.toFixed(2)}`)).toBeTruthy();
    expect(screen.getByText(`$${tax.toFixed(2)}`)).toBeTruthy();
    expect(screen.getByText(`$${total.toFixed(2)}`)).toBeTruthy();

    // Navigate to checkout
    fireEvent.press(screen.getByText('Proceed to Checkout'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('increments and decrements within bounds, and prevents out-of-bounds updates', async () => {
    const item = makeItem({
      id: 'a',
      name: 'Item A',
      price: 20,
      quantity: 2,
      stock: 3,
    });
    const {store} = renderWithStore([item]);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // Increase quantity: 2 -> 3 (allowed, stock=3)
    fireEvent.press(screen.getByTestId('inc-a'));
    await waitFor(() => {
      const qty = store.getState().cart.items.find(i => i.id === 'a')?.quantity;
      expect(qty).toBe(3);
    });

    // Try to increase beyond stock: 3 -> 4 should NOT change
    fireEvent.press(screen.getByTestId('inc-a'));
    await waitFor(() => {
      const qty = store.getState().cart.items.find(i => i.id === 'a')?.quantity;
      expect(qty).toBe(3);
    });

    // Decrease quantity: 3 -> 2 (allowed)
    fireEvent.press(screen.getByTestId('dec-a'));
    await waitFor(() => {
      const qty = store.getState().cart.items.find(i => i.id === 'a')?.quantity;
      expect(qty).toBe(2);
    });

    // Lower bound: render with quantity 1, pressing dec shouldn't change
    const {store: store2} = renderWithStore([
      makeItem({id: 'a', name: 'Item A', price: 20, quantity: 1, stock: 3}),
    ]);
    await act(async () => {
      jest.advanceTimersByTime(500);
    });
    fireEvent.press(screen.getByTestId('dec-a'));
    await waitFor(() => {
      const qty = store2
        .getState()
        .cart.items.find(i => i.id === 'a')?.quantity;
      expect(qty).toBe(1);
    });
  });

  it('removes item on remove press', async () => {
    const item = makeItem({
      id: 'a',
      name: 'Item A',
      price: 20,
      quantity: 2,
      stock: 3,
    });
    const {store} = renderWithStore([item]);

    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    fireEvent.press(screen.getByTestId('rm-a'));

    await waitFor(() => {
      const hasItem = store.getState().cart.items.some(i => i.id === 'a');
      expect(hasItem).toBe(false);
    });
  });
});
