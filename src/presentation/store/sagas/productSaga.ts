import { call, put, select, takeLatest } from 'redux-saga/effects';
import { repositories } from '../../../data/repositories';
import {
  fetchProductsFailure,
  fetchProductsSuccess,
  setCategories
} from '../slices/productSlice';

function* fetchProductsSaga(): Generator<any, void, any> {
  try {
    const state = yield select();
    const { filter } = state.products;
    
    const response = yield call(
      repositories.productRepository.getAll,
      filter.page,
      filter.limit,
      {
        searchQuery: filter.searchQuery,
        category: filter.category,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
      }
    );
    
    yield put(fetchProductsSuccess(response));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    yield put(fetchProductsFailure(errorMessage));
  }
}

function* fetchCategoriesSaga(): Generator<any, void, any> {
  try {
    const categories = yield call(repositories.productRepository.getCategories);
    yield put(setCategories(categories));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
    console.error('Failed to fetch categories:', errorMessage);
  }
}

export function* productSaga() {
  yield takeLatest('products/fetchProductsStart', fetchProductsSaga);
  yield takeLatest('products/fetchCategories', fetchCategoriesSaga);
}