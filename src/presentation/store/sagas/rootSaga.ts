import { all, fork } from 'redux-saga/effects';
import { productSaga } from './productSaga';

export function* rootSaga() {
  yield all([
    fork(productSaga),
    // Add other sagas here
  ]);
}