import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { CartItem } from '../CartItem';
import { removeFromCart, selectCartItems, selectTotalItems, selectTotalPrice, updateQuantity } from '@/src/presentation/store/slices/cartSlice';
import {SCREENS} from '@/src/utils/const';
export default function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate taxes and total
  const TAX_RATE = 0.1; // 10% tax
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + tax;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleIncreaseQuantity = useCallback((productId: string) => {
    const item = items.find(item => item.id === productId);
    if (item && item.quantity < item.stock) {
      dispatch(updateQuantity({ id: productId, quantity: item.quantity + 1 }));
    }
  }, [dispatch, items]);

  const handleDecreaseQuantity = useCallback((productId: string) => {
    const item = items.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ id: productId, quantity: item.quantity - 1 }));
    }
  }, [dispatch, items]);

  const handleRemoveItem = useCallback((productId: string) => {
    dispatch(removeFromCart(productId));
  }, [dispatch]);

const handleCheckout = useCallback(() => {
  navigation.navigate(SCREENS.Checkout);
}, [navigation]);
  
const handleKeepBuying = useCallback(() => {
  navigation.navigate(SCREENS.ProductList);
}, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <CartItem
      item={item}
      onIncrease={handleIncreaseQuantity}
      onDecrease={handleDecreaseQuantity}
      onRemove={handleRemoveItem}
    />
  ), [handleIncreaseQuantity, handleDecreaseQuantity, handleRemoveItem]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate(SCREENS.ProductList)}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal ({totalItems} items):</Text>
                  <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax (10%):</Text>
                  <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
                </View>
              </View>
            }
          />
          
            <View style={styles.checkoutContainer}>
              <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleKeepBuying}
              >
              <Ionicons name="arrow-back" size={20} color="#fff" style={styles.checkoutIconBack} />
              <Text style={styles.checkoutButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.checkoutIconForward} />
              </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 30,
  },
  listContent: {
    padding: 15,
    paddingBottom: 80, // Space for the checkout button
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  checkoutIconForward: {
    marginLeft: 5,
  },
  checkoutIconBack: {
    marginRight: 10
  },
});