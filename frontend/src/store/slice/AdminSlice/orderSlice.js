import { createSlice } from "@reduxjs/toolkit";
import { adminOrderApi } from "@/api/adminApi/orderApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

export const fetchOrders = makeApiThunk(
  "adminOrder/fetchOrders",
  adminOrderApi.list,
  "Failed to load orders",
);
export const fetchOrder = makeApiThunk(
  "adminOrder/fetchOrder",
  adminOrderApi.get,
  "Failed to load order",
);
// The header bell: how many orders are still waiting for confirmation.
export const fetchPendingOrders = makeApiThunk(
  "adminOrder/fetchPendingOrders",
  () => adminOrderApi.list({ status: "placed", limit: 5 }),
  "Failed to load pending orders",
);
export const updateOrderStatus = makeWriteThunk(
  "adminOrder/updateOrderStatus",
  ({ id, status }) => adminOrderApi.updateStatus(id, status),
  "Failed to update order status",
  (state) => [fetchOrders(state.adminOrder.lastParams), fetchPendingOrders()],
);

const initialState = {
  list: null, // { items, pagination }
  lastParams: undefined,
  listRequestId: null,
  order: null,
  pendingTotal: 0,
  loading: false,
  loadingOrder: false,
  updatingStatus: false,
  error: null,
  orderError: null,
  mutationError: null,
};

const orderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.orderError = null;
      state.mutationError = null;
    },
    clearSelectedOrder: (state) => {
      state.order = null;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchOrders.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      // DETAILS
      .addCase(fetchOrder.pending, (state, action) => {
        state.loadingOrder = true;
        state.orderError = null;
        if (state.order?.id !== action.meta.arg) state.order = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loadingOrder = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loadingOrder = false;
        state.orderError = action.payload;
      })

      // PENDING COUNT
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.pendingTotal = action.payload?.pagination?.total ?? 0;
      })

      // STATUS
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingStatus = true;
        state.mutationError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingStatus = false;
        if (state.order?.id === action.payload?.id) state.order = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingStatus = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearOrderError, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
