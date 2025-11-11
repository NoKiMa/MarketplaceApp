import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductFilter } from '../../domain/models/Product';

// Sample products data
const sampleProducts: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 199.99,
    rating: 4.7,
    stock: 50,
    category: 'Electronics',
    images: ['https://picsum.photos/300/300?random=101'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_002',
    name: 'Leather Wallet',
    description: 'Genuine leather wallet with multiple card slots and RFID protection.',
    price: 49.99,
    rating: 4.5,
    stock: 120,
    category: 'Accessories',
    images: ['https://picsum.photos/300/300?random=102'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_003',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with fitness tracking and heart rate monitor.',
    price: 249.99,
    rating: 4.8,
    stock: 35,
    category: 'Electronics',
    images: ['https://picsum.photos/300/300?random=103'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_004',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors.',
    price: 24.99,
    rating: 4.3,
    stock: 200,
    category: 'Clothing',
    images: ['https://picsum.photos/300/300?random=104'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_005',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 29.99,
    rating: 4.6,
    stock: 85,
    category: 'Home',
    images: ['https://picsum.photos/300/300?random=105'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Generate mock products
const generateMockProducts = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Accessories'];
  const mockProducts: Product[] = [...sampleProducts];

  // Generate additional random products if needed
  for (let i = mockProducts.length + 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    mockProducts.push({
      id: uuidv4(),
      name: `${category} ${i}`,
      description: `This is a description for Product ${i}. It's a great ${category.toLowerCase()} item.`,
      price: Math.floor(Math.random() * 1000) + 10,
      rating: Number((Math.random() * 5).toFixed(1)),
      stock: Math.floor(Math.random() * 100),
      category,
      images: [`https://picsum.photos/300/300?random=${i + 100}`],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return mockProducts;
};

// In-memory database
const products = generateMockProducts(100);

export const mockProductApi = {
  getProducts: async (filter: ProductFilter) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProducts = [...products];

    // Apply search filter
    if (filter.searchQuery) {
      const searchQuery = filter.searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product => {
        // Split product name into words and check if any word starts with the search query
        const nameWords = product.name.toLowerCase().split(/\s+/);
        return nameWords.some(word => word.startsWith(searchQuery));
      });
    }

    // Apply category filter
    if (filter.category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === filter.category
      );
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      const aValue = a[filter.sortBy];
      const bValue = b[filter.sortBy];
      
      if (aValue < bValue) return filter.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filter.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = (filter.page - 1) * filter.limit;
    const endIndex = startIndex + filter.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      total: filteredProducts.length,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(filteredProducts.length / filter.limit),
    };
  },

  getProductById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = products.find(p => p.id === id);
    return {
      success: !!product,
      data: product || undefined,
      error: product ? undefined : 'Product not found',
    };
  },

  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = Array.from(new Set(products.map(p => p.category)));
    return categories;
  },

  getFeaturedProducts: async (limit: number) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },
};
