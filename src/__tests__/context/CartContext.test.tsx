import React from 'react';
import { render, renderHook, act } from '@testing-library/react-native';
import { CartProvider, useCart } from '../../contexts/CartContext';
import { Product } from '../../domain/models/Product';

describe('CartContext', () => {
  // Test product data
  const testProduct1: Product = {
    id: '1',
    name: 'Test Product 1',
    price: 100,
    description: 'Test Description 1',
    image: 'test1.jpg',
  };

  const testProduct2: Product = {
    id: '2',
    name: 'Test Product 2',
    price: 200,
    description: 'Test Description 2',
    image: 'test2.jpg',
  };

  // Helper function to render the CartProvider with a test component
  const renderCartProvider = () => {
    return renderHook(() => useCart(), {
      wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
    });
  };

  it('should initialize with an empty cart', () => {
    const { result } = renderCartProvider();
    
    expect(result.current.items).toEqual([]);
    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderCartProvider();
    
    act(() => {
      result.current.addToCart(testProduct1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product).toEqual(testProduct1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.getItemCount()).toBe(1);
    expect(result.current.getCartTotal()).toBe(100);
  });

  it('should increment quantity when adding the same product multiple times', () => {
    const { result } = renderCartProvider();
    
    act(() => {
      result.current.addToCart(testProduct1);
      result.current.addToCart(testProduct1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.getItemCount()).toBe(2);
    expect(result.current.getCartTotal()).toBe(200);
  });

  it('should add multiple different products to the cart', () => {
    const { result } = renderCartProvider();
    
    act(() => {
      result.current.addToCart(testProduct1);
      result.current.addToCart(testProduct2);
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.getItemCount()).toBe(2);
    expect(result.current.getCartTotal()).toBe(300);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderCartProvider();
    
    // Add items first
    act(() => {
      result.current.addToCart(testProduct1);
      result.current.addToCart(testProduct2);
    });

    // Remove one item
    act(() => {
      result.current.removeFromCart(testProduct1.id);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].product).toEqual(testProduct2);
    expect(result.current.getItemCount()).toBe(1);
    expect(result.current.getCartTotal()).toBe(200);
  });

  it('should update the quantity of an item', () => {
    const { result } = renderCartProvider();
    
    // Add item first
    act(() => {
      result.current.addToCart(testProduct1);
    });

    // Update quantity
    act(() => {
      result.current.updateQuantity(testProduct1.id, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.getItemCount()).toBe(3);
    expect(result.current.getCartTotal()).toBe(300);
  });

  it('should remove item when quantity is set to 0 or negative', () => {
    const { result } = renderCartProvider();
    
    // Add item first
    act(() => {
      result.current.addToCart(testProduct1);
    });

    // Update quantity to 0
    act(() => {
      result.current.updateQuantity(testProduct1.id, 0);
    });

    expect(result.current.items.length).toBe(0);
    expect(result.current.getItemCount()).toBe(0);
  });

  it('should clear the cart', () => {
    const { result } = renderCartProvider();
    
    // Add items first
    act(() => {
      result.current.addToCart(testProduct1);
      result.current.addToCart(testProduct2);
    });

    // Clear cart
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should throw an error when useCart is used outside CartProvider', () => {
    // Create a test component that uses useCart without a provider
    const TestComponent = () => {
      useCart();
      return null;
    };

    // Suppress the expected error in the console
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useCart must be used within a CartProvider');

    // Restore console.error
    console.error = originalError;
  });
});