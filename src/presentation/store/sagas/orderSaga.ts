import { call, put, takeLatest } from 'redux-saga/effects';
import { repositories } from '../../../data/repositories';
import { fetchOrderFailure, fetchOrderStart, fetchOrderSuccess } from '../slices/orderSlice';

export function* fetchOrderSaga(action: ReturnType<typeof fetchOrderStart>): Generator<any, void, any> {
  try {
    const response = yield call(
      repositories.orderRepository.createOrder,
      action.payload
    );

    if (response?.success && response.order) {
      yield put(fetchOrderSuccess(response.order));
    } else {
      const message = response?.error || 'Failed to create order';
      yield put(fetchOrderFailure(message));
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    yield put(fetchOrderFailure(errorMessage));
  }
}

export function* orderSaga() {
  yield takeLatest('order/fetchOrderStart', fetchOrderSaga);
}