import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { OrderRepositoryImpl } from '../../../data/repositories/OrderRepositoryImpl';
import { RootStackParamList } from '../../navigation/types';
import { clearCart, selectCartItems, selectTotalPrice } from '../../store/slices/cartSlice';
import {SCREENS} from '@/src/utils/const';
type CheckoutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CheckoutScreen'>;

const Checkout = () => {
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const orderRepository = new OrderRepositoryImpl();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'United States',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Form validation
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.address || !formData.city || !formData.postalCode) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        userId: 'user_123', // In a real app, get this from auth context
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        totalAmount: totalPrice,
        status: 'processing' as const
      };

      const newOrder = await orderRepository.createOrder(orderData);
      
      // Clear the cart after successful order
      dispatch(clearCart());
      
      // Navigate to order confirmation screen with the new order ID
      navigation.navigate(SCREENS.OrderConfirmation, { orderId: newOrder.id });
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text>{item.name} x {item.quantity}</Text>
            <Text>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalText}>${totalPrice.toFixed(2)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={[styles.input, !formData.firstName && styles.inputError]}
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={[styles.input, !formData.lastName && styles.inputError]}
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, !formData.email && styles.inputError]}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, !formData.address && styles.inputError]}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <Text style={styles.label}>City</Text>
        <TextInput
          style={[styles.input, !formData.city && styles.inputError]}
          placeholder="City"
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
        <Text style={styles.label}>Postal Code</Text>
        <TextInput
          style={[styles.input, !formData.postalCode && styles.inputError]}
          placeholder="Postal Code"
          value={formData.postalCode}
          onChangeText={(text) => handleInputChange('postalCode', text)}
          keyboardType="number-pad"
        />
        <Text style={styles.label}>Country</Text>
        <TextInput
          style={[styles.input]}
          placeholder="Country"
          value={formData.country}
          editable={false}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Place Order (${totalPrice.toFixed(2)})
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    // marginTop: 10,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footer: {
    padding: 16,
    marginBottom:10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'flex-end',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Checkout;
