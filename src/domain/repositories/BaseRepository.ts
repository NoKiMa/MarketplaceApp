import { ApiResponse, PaginatedResponse } from '../models/Product';

export interface BaseRepository<T> {
  getAll(
    page: number,
    limit: number,
    filter?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>>;
  
  getById(id: string): Promise<ApiResponse<T>>;
  
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<T>>;
  
  update(
    id: string,
    item: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<ApiResponse<T>>;
  
  delete(id: string): Promise<ApiResponse<boolean>>;
}
