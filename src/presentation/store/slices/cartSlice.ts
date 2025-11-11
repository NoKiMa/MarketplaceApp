import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Product} from '../../../domain/models/Product';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      if (product.stock <= 0) {
        throw new Error('Product is out of stock');
      }

      const availableQuantity = Math.min(quantity, product.stock);

      if (existingItem) {
        if (existingItem.quantity + availableQuantity > product.stock) {
          throw new Error('Not enough stock available');
        }
        existingItem.quantity += availableQuantity;
      } else {
        state.items.push({
          ...product,
          quantity: availableQuantity,
        });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{id: string; quantity: number}>,
    ) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

// Selectors
export const selectCartItems = (state: {cart: CartState}) => state.cart.items;

export const selectTotalItems = (state: {cart: CartState}) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: {cart: CartState}) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

export const {addToCart, removeFromCart, updateQuantity, clearCart} =
  cartSlice.actions;
export default cartSlice.reducer;
