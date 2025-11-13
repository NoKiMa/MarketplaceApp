import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SCREENS } from '../../../utils/const';
import { RootStackParamList } from '../../navigation/types';
import { clearOrder, selectCurrentOrder } from '../../store/slices/orderSlice';

type OrderConfirmationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderConfirmationScreen'>;

export default function OrderConfirmationScreen() {
  const currentOrder = useSelector(selectCurrentOrder);
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const navigation = useNavigation<OrderConfirmationScreenNavigationProp>();
  const dispatch = useDispatch();

  const orderDate = currentOrder ? new Date(currentOrder.createdAt) : new Date();
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(orderDate.getDate() + 3);

  const handleContinueShopping = () => {
    dispatch(clearOrder());
    navigation.navigate(SCREENS.ProductList);
  };

  const handleViewOrders = () => {
    dispatch(clearOrder());
    Alert.alert('View Orders', 'This would show your order history');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>Thank you for your purchase</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Number:</Text>
            <Text style={styles.infoValue}>#{orderId || currentOrder?.id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date:</Text>
            <Text style={styles.infoValue}>{format(orderDate, 'MMM d, yyyy h:mm a')}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estimated Delivery:</Text>
            <Text style={styles.infoValue}>{format(estimatedDelivery, 'EEEE, MMM d, yyyy')}</Text>
          </View>
          
          <View style={[styles.infoRow, styles.statusContainer]}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{(currentOrder?.status || 'processing').toUpperCase()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          {currentOrder?.items?.length ? (
            currentOrder.items.map((item, idx) => (
              <View key={idx} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.name} x {item.quantity}</Text>
                <Text style={styles.infoValue}>{item.price}</Text>
              </View>
            ))
          ) : (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>No items</Text>
            </View>
          )}
          <View style={[styles.infoRow, styles.statusContainer]}>
            <Text style={styles.infoLabel}>Total:</Text>
            <Text style={styles.infoValue}>
              {typeof currentOrder?.total === 'number' ? `$${currentOrder.total.toFixed(2)}` : '-'}
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={handleContinueShopping}
          >
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleViewOrders}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Orders</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  orderInfo: {
    width: '100%',
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'right',
  },
  statusContainer: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  statusBadge: {
    backgroundColor: '#fff8e1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe0b2',
  },
  statusText: {
    color: '#ff8f00',
    fontWeight: '600',
    fontSize: 14,
  },
  actions: {
    width: '100%',
    maxWidth: 400,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#3498db',
  },
});