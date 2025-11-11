import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { mockProductApi } from '../../data/api/mockProductApi';

// Мокаем mockProductApi
jest.mock('../../data/api/mockProductApi');

describe('ProductRepositoryImpl', () => {
  let productRepository: ProductRepositoryImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    productRepository = new ProductRepositoryImpl();
  });

  describe('getAll', () => {
    it('should return paginated product list', async () => {
      const mockResponse = {
        data: [{ id: 'prod_001', name: 'Test Product', price: 100 }],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      (mockProductApi.getProducts as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productRepository.getAll(1, 10);

      expect(mockProductApi.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sortBy: 'price',
          sortOrder: 'asc',
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when fetching products', async () => {
      (mockProductApi.getProducts as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(productRepository.getAll()).rejects.toThrow('API Error');
    });
  });

  describe('getById', () => {
    it('should return product by id', async () => {
      const mockProduct = {
        success: true,
        data: { id: 'prod_001', name: 'Wireless Headphones', price: 199.99 },
      };

      (mockProductApi.getProductById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productRepository.getById('prod_001');

      expect(mockProductApi.getProductById).toHaveBeenCalledWith('prod_001');
      expect(result).toEqual(mockProduct);
    });

    it('should handle product not found', async () => {
      const mockResponse = { success: false, data: undefined, error: 'Product not found' };

      (mockProductApi.getProductById as jest.Mock).mockResolvedValue(mockResponse);

      const result = await productRepository.getById('nonexistent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Product not found');
    });
  });

  describe('getCategories', () => {
    it('should return product categories', async () => {
      const mockCategories = ['Electronics', 'Home', 'Books'];
      (mockProductApi.getCategories as jest.Mock).mockResolvedValue(mockCategories);

      const result = await productRepository.getCategories();

      expect(mockProductApi.getCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });
  });

  describe('searchProducts', () => {
    it('should search products using provided filters', async () => {
      const mockProducts = {
        data: [
          { id: 'prod_002', name: 'Smart Watch', price: 249.99 },
          { id: 'prod_003', name: 'Wireless Earbuds', price: 149.99 },
        ],
      };

      (mockProductApi.getProducts as jest.Mock).mockResolvedValue(mockProducts);

      const filters = { searchQuery: 'wireless', sortBy: 'price', sortOrder: 'asc' };

      const result = await productRepository.searchProducts(filters);

      expect(mockProductApi.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          ...filters,
          page: 1,
          limit: 1000,
        })
      );

      expect(result).toEqual(mockProducts.data);
    });
  });

  describe('getFeaturedProducts', () => {
    it('should return featured products by limit', async () => {
      const mockFeatured = [
        { id: 'prod_001', name: 'Wireless Headphones', rating: 4.7 },
        { id: 'prod_002', name: 'Smart Watch', rating: 4.8 },
      ];

      (mockProductApi.getFeaturedProducts as jest.Mock).mockResolvedValue(mockFeatured);

      const result = await productRepository.getFeaturedProducts(2);

      expect(mockProductApi.getFeaturedProducts).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockFeatured);
    });
  });
});
