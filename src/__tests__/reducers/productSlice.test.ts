import productReducer, {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchQuery,
  setCategory,
  setSort,
  setPage,
  setCategories,
  resetFilters,
  ProductState
} from '../../presentation/store/slices/productSlice';
import {Product} from '../../domain/models/Product';


describe('product slice', () => {
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

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Desc',
      price: 10,
      rating: 4.2,
      stock: 10,
      category: 'A',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Desc',
      price: 20,
      rating: 4.5,
      stock: 5,
      category: 'B',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('should return initial state by default', () => {
    expect(productReducer(undefined, {type: 'unknown'})).toEqual(initialState);
  });

  describe('fetchProductsStart', () => {
    it('should set loading true and clear error', () => {
      const state = productReducer(initialState, fetchProductsStart());
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchProductsSuccess', () => {
    it('should populate products and pagination', () => {
      const payload = {
        data: mockProducts,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const state = productReducer(initialState, fetchProductsSuccess(payload));

      expect(state.loading).toBe(false);
      expect(state.products).toEqual(mockProducts);
      expect(state.pagination.total).toBe(2);
      expect(state.pagination.page).toBe(1);
    });
  });

  describe('fetchProductsFailure', () => {
    it('should set error and stop loading', () => {
      const state = productReducer(
        {...initialState, loading: true},
        fetchProductsFailure('Network error'),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('setSearchQuery', () => {
    it('should update searchQuery and reset page to 1', () => {
      const state = productReducer(
        {...initialState, filter: {...initialState.filter, page: 3}},
        setSearchQuery('laptop'),
      );
      expect(state.filter.searchQuery).toBe('laptop');
      expect(state.filter.page).toBe(1);
    });
  });

  describe('setCategory', () => {
    it('should update category and reset page to 1', () => {
      const state = productReducer(
        {...initialState, filter: {...initialState.filter, page: 2}},
        setCategory('Electronics'),
      );
      expect(state.filter.category).toBe('Electronics');
      expect(state.filter.page).toBe(1);
    });
  });

  describe('setSort', () => {
    it('should update sortBy and sortOrder', () => {
      const state = productReducer(
        initialState,
        setSort({sortBy: 'rating', sortOrder: 'desc'}),
      );
      expect(state.filter.sortBy).toBe('rating');
      expect(state.filter.sortOrder).toBe('desc');
    });
  });

  describe('setPage', () => {
    it('should update current page', () => {
      const state = productReducer(initialState, setPage(3));
      expect(state.filter.page).toBe(3);
    });
  });

  describe('setCategories', () => {
    it('should update categories list', () => {
      const state = productReducer(
        initialState,
        setCategories(['Tech', 'Home']),
      );
      expect(state.categories).toEqual(['Tech', 'Home']);
    });
  });

  describe('resetFilters', () => {
    it('should reset filters to initial values', () => {
      const modifiedState: ProductState = {
        ...initialState,
        filter: {
          searchQuery: 'phone',
          category: 'Tech',
          sortBy: 'rating',
          sortOrder: 'desc',
          page: 5,
          limit: 20,
        },
      };

      const state = productReducer(modifiedState, resetFilters());
      expect(state.filter).toEqual(initialState.filter);
    });
  });
});
