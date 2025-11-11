import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { mockProductApi } from '../../../data/api/mockProductApi';
import { Product, ProductFilter, SortOrder } from '../../../domain/models/Product';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/configureStore';
import {SCREENS} from '@/src/utils/const';
const ITEMS_PER_PAGE = 10;

// Product Card Component
const ProductCard = ({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image
      source={{uri: product.images[0]}}
      style={styles.productImage}
      resizeMode="cover"
    />
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={1}>
        {product.name}
      </Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{product.rating.toFixed(1)} ★</Text>
        <Text style={styles.stockText}>{product.stock} in stock</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigation = useNavigation();
    const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity 
            style={styles.cartIconContainer}
            onPress={() => navigation.navigate(SCREENS.Cart)}
          >
            <Ionicons name="cart-outline" size={24} color="#000" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ),
      });
    }, [navigation, cartItemCount]);

  useEffect(() => {
    loadProducts(true);
  }, [sortOrder, searchQuery, selectedCategory]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate( SCREENS.ProductDetails, {productId: product.id});
    },
    [navigation],
  );

  const renderProductItem = useCallback(
    ({item}: {item: Product}) => (
      <ProductCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [handleProductPress],
  );

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }, [loading]);
  const toggleSortOrder = useCallback(() => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  }, []);

  const loadProducts = useCallback(
    async (isRefreshing = false) => {
      if (loading) return;

      try {
        setLoading(true);
        const currentPage = isRefreshing ? 1 : page;

        const filter: ProductFilter = {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          sortBy: 'price',
          sortOrder,
          searchQuery: searchQuery || undefined,
          category: selectedCategory || undefined,
        };

        const data = await mockProductApi.getProducts(filter);
        const productsData: Product[] = data.data;

        if (isRefreshing) {
          setProducts(productsData);
        } else {
          setProducts(prev => (currentPage === 1 ? productsData : [...prev, ...productsData]));
        }

        setHasMore(productsData.length === ITEMS_PER_PAGE);
        if (!isRefreshing) {
          setPage(currentPage + 1);
        } else {
          setPage(2);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, sortOrder, searchQuery, selectedCategory, loading],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts(true);
  }, [loadProducts]);

  const onEndReached = useCallback(() => {
    if (!loading && hasMore) {
      loadProducts();
    }
  }, [loading, hasMore, loadProducts]);

  const applyFilters = useCallback((category: string | null) => {
    setSelectedCategory(category);
    setPage(1);
    setShowFilters(false);
  }, []);

  // Add this effect to load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await mockProductApi.getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      {/* Search and filter UI */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}>
          <Text>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Button */}
      <View style={styles.sortContainer}>
        <Text>Sort by: Price </Text>
        <TouchableOpacity onPress={toggleSortOrder}>
          <Text style={styles.sortButton}>
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilters(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <ScrollView>
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  !selectedCategory && styles.selectedCategory,
                ]}
                onPress={() => applyFilters(null)}>
                <Text>All Categories</Text>
              </TouchableOpacity>
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategory === category && styles.selectedCategory,
                  ]}
                  onPress={() => applyFilters(category)}>
                  <Text>{category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilters(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  list: {
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  productInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingText: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  stockText: {
    color: '#666',
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  categoryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#e3f2fd',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cartIconContainer: {
    marginRight: 10,
    flexDirection: 'row',
  },
  cartBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
