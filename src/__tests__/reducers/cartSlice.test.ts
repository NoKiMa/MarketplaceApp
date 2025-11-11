import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  CartState,
} from '../../../src/presentation/store/slices/cartSlice';
import {Product} from '../../../src/domain/models/Product';

describe('cart slice', () => {
  const initialState: CartState = {
    items: [],
  };

  const testProduct1: Product = {
    id: '1',
    name: 'Test Product 1',
    price: 100,
    description: 'Test Description 1',
    image: 'test1.jpg',
    stock: 5,
  };

  const testProduct2: Product = {
    id: '2',
    name: 'Test Product 2',
    price: 200,
    description: 'Test Description 2',
    image: 'test2.jpg',
    stock: 3,
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(cartReducer(undefined, {type: 'unknown'})).toEqual(initialState);
    });

    describe('addToCart', () => {
      it('should add a new product to the cart', () => {
        const action = addToCart({product: testProduct1, quantity: 1});
        const state = cartReducer(initialState, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0]).toEqual({...testProduct1, quantity: 1});
      });

      it('should increment quantity when adding existing product', () => {
        const stateWithItem = {
          items: [{...testProduct1, quantity: 1}],
        };

        const action = addToCart({product: testProduct1, quantity: 2});
        const state = cartReducer(stateWithItem, action);

        expect(state.items[0].quantity).toBe(3);
      });

      it('should throw error when product is out of stock', () => {
        const outOfStockProduct = {...testProduct1, stock: 0};

        expect(() => {
          cartReducer(
            initialState,
            addToCart({product: outOfStockProduct, quantity: 1}),
          );
        }).toThrow('Product is out of stock');
      });
    });

    describe('removeFromCart', () => {
      it('should remove an item from the cart', () => {
        const stateWithItems = {
          items: [testProduct1, testProduct2],
        };

        const action = removeFromCart(testProduct1.id);
        const state = cartReducer(stateWithItems, action);

        expect(state.items).toHaveLength(1);
        expect(state.items[0].id).toBe(testProduct2.id);
      });

      it('should do nothing if item not found', () => {
        const stateWithItems = {
          items: [testProduct1],
        };

        const action = removeFromCart('non-existent-id');
        const state = cartReducer(stateWithItems, action);

        expect(state.items).toHaveLength(1);
      });
    });

    describe('updateQuantity', () => {
      it('should update quantity of an existing item', () => {
        const stateWithItem = {
          items: [{...testProduct1, quantity: 1}],
        };

        const action = updateQuantity({id: testProduct1.id, quantity: 3});
        const state = cartReducer(stateWithItem, action);

        expect(state.items[0].quantity).toBe(3);
      });

      it('should do nothing if item not found', () => {
        const stateWithItem = {
          items: [{...testProduct1, quantity: 1}],
        };

        const action = updateQuantity({id: 'non-existent-id', quantity: 5});
        const state = cartReducer(stateWithItem, action);

        expect(state.items[0].quantity).toBe(1);
      });
    });

    describe('clearCart', () => {
      it('should remove all items from the cart', () => {
        const stateWithItems = {
          items: [testProduct1, testProduct2],
        };

        const state = cartReducer(stateWithItems, clearCart());
        expect(state.items).toHaveLength(0);
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      cart: {
        items: [
          {...testProduct1, quantity: 2},
          {...testProduct2, quantity: 1},
        ],
      },
    };

    it('should select cart items', () => {
      expect(selectCartItems(testState)).toEqual(testState.cart.items);
    });

    it('should calculate total items', () => {
      expect(selectTotalItems(testState)).toBe(3); // 2 + 1
    });

    it('should calculate total price', () => {
      // (100 * 2) + (200 * 1) = 400
      expect(selectTotalPrice(testState)).toBe(400);
    });

    it('should return 0 for empty cart', () => {
      const emptyState = {cart: {items: []}};
      expect(selectTotalItems(emptyState)).toBe(0);
      expect(selectTotalPrice(emptyState)).toBe(0);
    });
  });
});
