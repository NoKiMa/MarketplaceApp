import { all } from 'redux-saga/effects';
import { productSaga } from './productSaga';
import { orderSaga } from './orderSaga';

export function* rootSaga() {
  yield all([
    productSaga(),
    orderSaga(),
  ]);
}