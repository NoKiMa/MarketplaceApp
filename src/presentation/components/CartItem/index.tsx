import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CartItem as CartItemType } from '../../../domain/models/Product';

interface CartItemProps {
  item: CartItemType;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onIncrease, onDecrease, onRemove }) => {
  const imageSource = useMemo(() => ({ uri: item.images[0] }), [item.images]);
  const isIncreaseDisabled = useMemo(() => item.quantity >= item.stock, [item.quantity, item.stock]);

  const handleIncrease = useCallback(() => onIncrease(item.id), [onIncrease, item.id]);
  const handleDecrease = useCallback(() => onDecrease(item.id), [onDecrease, item.id]);
  const handleRemove = useCallback(() => onRemove(item.id), [onRemove, item.id]);

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={handleIncrease}
            style={styles.quantityButton}
            disabled={isIncreaseDisabled}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
      </TouchableOpacity>
    </View>
  );
};

export const CartItem = React.memo(
  CartItemComponent,
  (prev, next) => {
    return (
      prev.item.id === next.item.id &&
      prev.item.name === next.item.name &&
      prev.item.price === next.item.price &&
      prev.item.quantity === next.item.quantity &&
      prev.item.stock === next.item.stock &&
      prev.item.images[0] === next.item.images[0]
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 5,
    marginLeft: 10,
  },
});