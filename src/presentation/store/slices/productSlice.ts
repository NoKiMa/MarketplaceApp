// src/presentation/store/slices/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilter, SortOrder } from '../../../domain/models/Product';
import { PaginatedResponse } from '../../../domain/models/Product';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filter: ProductFilter;
  pagination: Omit<PaginatedResponse<Product>, 'data'>;
  categories: string[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filter: {
    searchQuery: '',
    category: null,
    sortBy: 'price',
    sortOrder: 'asc',
    page: 1,
    limit: 10,
  },
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  categories: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action: PayloadAction<PaginatedResponse<Product>>) {
      state.loading = false;
      state.products = action.payload.data;
      const { data, ...pagination } = action.payload;
      state.pagination = pagination;
    },
    fetchProductsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.filter.searchQuery = action.payload;
      state.filter.page = 1; // Reset to first page on new search
    },
    setCategory(state, action: PayloadAction<string | null>) {
      state.filter.category = action.payload;
      state.filter.page = 1; // Reset to first page when category changes
    },
    setSort(state, action: PayloadAction<{ sortBy: 'price' | 'rating' | 'name'; sortOrder: SortOrder }>) {
      state.filter.sortBy = action.payload.sortBy;
      state.filter.sortOrder = action.payload.sortOrder;
    },
    setPage(state, action: PayloadAction<number>) {
      state.filter.page = action.payload;
    },
    setCategories(state, action: PayloadAction<string[]>) {
      state.categories = action.payload;
    },
    resetFilters(state) {
      state.filter = initialState.filter;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchQuery,
  setCategory,
  setSort,
  setPage,
  setCategories,
  resetFilters,
} = productSlice.actions;

export default productSlice.reducer;