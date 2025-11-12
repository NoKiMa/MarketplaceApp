import React from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react-native';
import ProductDetails from '../../presentation/components/ProductDetails';
import cartReducer from '../../presentation/store/slices/cartSlice';
import {Alert} from 'react-native';

// Mocks for expo-router
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockSetOptions = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({productId: 'p1'}),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    setOptions: mockSetOptions,
  }),
}));

// Mock vector icons to avoid expo-font ESM issues
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock API
jest.mock('../../data/api/mockProductApi', () => ({
  mockProductApi: {
    getProductById: jest.fn(),
  },
}));
import {mockProductApi} from '../../data/api/mockProductApi';

// Spy on Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

const makeProduct = (overrides: Partial<any> = {}) => ({
  id: overrides.id ?? 'p1',
  name: overrides.name ?? 'Phone X',
  brand: overrides.brand ?? 'BrandCo',
  images: overrides.images ?? ['https://example.com/img.jpg'],
  price: overrides.price ?? 999.99,
  rating: overrides.rating ?? 4.5,
  stock: overrides.stock ?? 3,
  category: overrides.category ?? 'phones',
  description: overrides.description ?? 'Great phone',
});

const renderWithStore = () => {
  const store = configureStore({
    reducer: {cart: cartReducer},
    preloadedState: {cart: {items: []}},
  });
  return render(
    <Provider store={store}>
      <ProductDetails />
    </Provider>,
  );
};

describe('ProductDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot (loaded in-stock product)', async () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456); // stable
    (mockProductApi.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: makeProduct({name: 'Phone X', stock: 5, rating: 4.5}),
    });

    const {toJSON} = renderWithStore();
    await waitFor(() => expect(screen.getByText('Phone X')).toBeTruthy());

    expect(toJSON()).toMatchSnapshot();
    randomSpy.mockRestore();
  });

  it('matches snapshot (out of stock)', async () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.123456); // stable
    (mockProductApi.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: makeProduct({name: 'Phone X', stock: 0, rating: 4.5}),
    });

    const {toJSON} = renderWithStore();
    await waitFor(() => expect(screen.getByText('Out of Stock')).toBeTruthy());

    expect(toJSON()).toMatchSnapshot();
    randomSpy.mockRestore();
  });

  it('loads and renders product data', async () => {
    (mockProductApi.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: makeProduct({name: 'Phone X'}),
    });

    renderWithStore();

    await waitFor(() => expect(screen.getByText('Phone X')).toBeTruthy());
    expect(screen.getByText('BrandCo')).toBeTruthy();
    expect(screen.getByText('$999.99')).toBeTruthy();

    expect(mockSetOptions).toHaveBeenCalled();
  });

  it('adds to cart, shows alert, and navigates on "View Cart"', async () => {
    (mockProductApi.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: makeProduct(),
    });

    renderWithStore();

    await waitFor(() => expect(screen.getByText('Add to Cart')).toBeTruthy());

    fireEvent.press(screen.getByText('Add to Cart'));

    expect(Alert.alert).toHaveBeenCalled();

    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const buttons = alertCall[2] as Array<{text: string; onPress?: () => void}>;
    const viewCartBtn = buttons?.find(b => b.text === 'View Cart');
    viewCartBtn?.onPress?.();

    await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
  });

  it('disables Add to Cart when out of stock', async () => {
    (mockProductApi.getProductById as jest.Mock).mockResolvedValue({
      success: true,
      data: makeProduct({stock: 0}),
    });

    renderWithStore();

    // Кнопка должна показывать Out of Stock
    await waitFor(() => expect(screen.getByText('Out of Stock')).toBeTruthy());

    const callsBefore = (Alert.alert as jest.Mock).mock.calls.length;

    // Пытаемся нажать по тексту на кнопке
    fireEvent.press(screen.getByText('Out of Stock'));

    // Убеждаемся, что Alert не вызван (onPress не сработал из-за disabled)
    await waitFor(() => {
      expect((Alert.alert as jest.Mock).mock.calls.length).toBe(callsBefore);
    });
  });

  it('renders "Product not found" and goes back', async () => {
    (mockProductApi.getProductById as jest.Mock).mockResolvedValue({
      success: false,
    });

    renderWithStore();

    await waitFor(() =>
      expect(screen.getByText('Product not found')).toBeTruthy(),
    );

    fireEvent.press(screen.getByText('Go Back'));

    await waitFor(() => expect(mockGoBack).toHaveBeenCalled());
  });
});
