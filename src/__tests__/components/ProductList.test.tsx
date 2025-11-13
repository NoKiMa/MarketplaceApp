import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react-native';
import ProductList from '../../presentation/components/ProductList';
import cartReducer from '../../presentation/store/slices/cartSlice';

// Mock navigation
const mockNavigate = jest.fn();
const mockSetOptions = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({navigate: mockNavigate, setOptions: mockSetOptions}),
}));
// Mock vector icons to avoid expo-font ESM issues
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('react-native/Libraries/Lists/FlatList', () => {
  const React = require('react');
  const RN = jest.requireActual('react-native');

  const FlatList = ({ data, renderItem }) =>
    React.createElement(
      RN.View,
      { testID: 'flatlist' },
      (data || []).map((item, index) => renderItem({ item, index }))
    );
  return { default: FlatList };
});

// Mock API
jest.mock('../../data/api/mockProductApi', () => ({
  mockProductApi: {
    getProducts: jest.fn(),
    getCategories: jest.fn(),
  },
}));

import {mockProductApi} from '../../data/api/mockProductApi';

const makeProduct = (overrides: Partial<any> = {}) => ({
  id: overrides.id ?? Math.random().toString(36).slice(2),
  name: overrides.name ?? 'Test Product',
  images: overrides.images ?? ['https://example.com/img.jpg'],
  price: overrides.price ?? 10,
  rating: overrides.rating ?? 4.2,
  stock: overrides.stock ?? 5,
  category: overrides.category ?? 'cat',
});

const renderWithStore = (preloadedCart = {items: [] as any[]}) => {
  const store = configureStore({
    reducer: {cart: cartReducer},
    preloadedState: {cart: preloadedCart},
  });
  return render(
    <Provider store={store}>
      <ProductList />
    </Provider>,
  );
};

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockProductApi.getCategories as jest.Mock).mockResolvedValue([
      'Phones',
      'Laptops',
    ]);
    (mockProductApi.getProducts as jest.Mock).mockResolvedValue({
      data: [
        makeProduct({id: 'p1', name: 'Phone'}),
        makeProduct({id: 'p2', name: 'Laptop'}),
      ],
    });
  });

it('matches snapshot after initial load', async () => {
  const { toJSON } = renderWithStore();

  await waitFor(() => {
    expect(screen.getByText('Phone')).toBeTruthy();
    expect(screen.getByText('Laptop')).toBeTruthy();
  });

  expect(toJSON()).toMatchSnapshot();
});

  it('loads and renders products', async () => {
    renderWithStore();

    await waitFor(() => {
      expect(screen.getByText('Phone')).toBeTruthy();
      expect(screen.getByText('Laptop')).toBeTruthy();
    });

    expect(mockSetOptions).toHaveBeenCalled();
    expect(mockProductApi.getProducts).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      sortBy: 'price',
      sortOrder: 'asc',
      searchQuery: undefined,
      category: undefined,
    });
  });

  it('filters by search query', async () => {
    renderWithStore();

    await waitFor(() => expect(screen.getByText('Phone')).toBeTruthy());

    const input = await screen.findByPlaceholderText('Search products...');
    (mockProductApi.getProducts as jest.Mock).mockResolvedValueOnce({
      data: [makeProduct({id: 'ps', name: 'Searched'})],
    });

    fireEvent.changeText(input, 'query');

    await waitFor(() =>
      expect(mockProductApi.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({searchQuery: 'query', page: 1}),
      ),
    );

    await waitFor(() => expect(screen.getByText('Searched')).toBeTruthy());
  });

  it('opens filter modal and applies category', async () => {
    renderWithStore();

    await waitFor(() => expect(screen.getByText('Phone')).toBeTruthy());

    const filterBtn = await screen.findByText('Filter');
    fireEvent.press(filterBtn);

    await waitFor(() =>
      expect(screen.getByText('All Categories')).toBeTruthy(),
    );

    (mockProductApi.getProducts as jest.Mock).mockResolvedValueOnce({
      data: [makeProduct({id: 'pc', name: 'Category Match'})],
    });

    const category = screen.getByText('Phones');
    fireEvent.press(category);

    await waitFor(() =>
      expect(mockProductApi.getProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({category: 'Phones', page: 1}),
      ),
    );

    await waitFor(() =>
      expect(screen.getByText('Category Match')).toBeTruthy(),
    );
  });

  it('navigates to product details on card press', async () => {
    renderWithStore();

    await waitFor(() => expect(screen.getByText('Phone')).toBeTruthy());

    // Press on product name (inside TouchableOpacity)
    const phone = screen.getByText('Phone');
    fireEvent.press(phone);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });
});
