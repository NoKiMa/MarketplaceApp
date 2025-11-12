import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderRequest } from '../../../domain/models/Order';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    fetchOrderStart(state, _action: PayloadAction<OrderRequest>) {
      state.loading = true;
      state.error = null;
    },
    fetchOrderSuccess(state, action: PayloadAction<Order>) {
      state.loading = false;
      state.currentOrder = action.payload;
      state.orders.push(action.payload);
    },
    fetchOrderFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrder(state) {
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },
  },
});

export const {
  fetchOrderStart,
  fetchOrderSuccess,
  fetchOrderFailure,
  clearOrder,
  setCurrentOrder,
} = orderSlice.actions;

export const selectCurrentOrder = (state: { order: OrderState }) => state.order.currentOrder;
export const selectOrderLoading = (state: { order: OrderState }) => state.order.loading;
export const selectOrderError = (state: { order: OrderState }) => state.order.error;
export const selectOrders = (state: { order: OrderState }) => state.order.orders;
export default orderSlice.reducer;