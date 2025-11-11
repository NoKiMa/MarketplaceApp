// src/__tests__/reducers/cartSlice.test.ts
import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart } from '../../presentation/store/slices/cartSlice';
// eslint-disable-next-line import/no-unresolved
import { Product } from '@/src/domain/models/Product';

describe('cart reducer', () => {
  const initialState = { items: [] };
  const testProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10.99,
    description: 'Test description',
    category: 'Test',
    images: ['image1.jpg'],
    rating: 4.5,
    stock: 10,
    createdAt: String(new Date()),
    updatedAt: String(new Date()),
    quantity: 1
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToCart', () => {
    const actual = cartReducer(initialState, addToCart({ product: testProduct, quantity: 1 }));
    expect(actual.items.length).toEqual(1);
    expect(actual.items[0].id).toEqual('1');
  });

  it('should handle removeFromCart', () => {
    const stateWithItem = { items: [testProduct] };
    const actual = cartReducer(stateWithItem, removeFromCart('1'));
    expect(actual.items.length).toEqual(0);
  });

  it('should handle updateQuantity', () => {
    const stateWithItem = { items: [{ ...testProduct, quantity: 1 }] };
    const actual = cartReducer(stateWithItem, updateQuantity({ id: '1', quantity: 3 }));
    expect(actual.items[0].quantity).toEqual(3);
  });

  it('should handle clearCart', () => {
    const stateWithItems = { items: [testProduct] };
    const actual = cartReducer(stateWithItems, clearCart());
    expect(actual.items.length).toEqual(0);
  });
});