import { Product, ProductFilter, ApiResponse } from '../../domain/models/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { mockProductApi } from '../api/mockProductApi';

export class ProductRepositoryImpl implements ProductRepository {
  async getAll(
    page: number = 1,
    limit: number = 10,
    filter: Record<string, unknown> = {}
  ) {
    return mockProductApi.getProducts({
      searchQuery: '',
      category: null,
      sortBy: 'price',
      sortOrder: 'asc',
      page,
      limit,
      ...filter,
    } as ProductFilter);
  }

  async getById(id: string): Promise<ApiResponse<Product>> {
    return mockProductApi.getProductById(id);
  }

  async create(item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> {
    // Implementation for create
    throw new Error('Method not implemented.');
  }

  async update(
    id: string,
    item: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<Product>> {
    // Implementation for update
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    // Implementation for delete
    throw new Error('Method not implemented.');
  }

  async getCategories(): Promise<string[]> {
    return mockProductApi.getCategories();
  }

  async searchProducts(filter: ProductFilter): Promise<Product[]> {
    const result = await mockProductApi.getProducts({
      ...filter,
      page: 1,
      limit: 1000, // High limit to get all matching products
    });
    return result.data;
  }

  async getFeaturedProducts(limit: number): Promise<Product[]> {
    return mockProductApi.getFeaturedProducts(limit);
  }
}
