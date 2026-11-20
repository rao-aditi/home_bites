import { createSlice } from "@reduxjs/toolkit";
import { orderApi } from "@/api/customerApi/orderApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { logout } from "./authSlice";

export const fetchOrders = makeApiThunk(
  "customerOrder/fetchOrders",
  orderApi.getOrders,
  "Failed to load orders",
  { condition: (_, { getState }) => !getState().customerOrder.loading },
);
export const fetchOrder = makeApiThunk(
  "customerOrder/fetchOrder",
  orderApi.getOrder,
  "Failed to load order",
);
export const createOrder = makeApiThunk(
  "customerOrder/createOrder",
  orderApi.createOrder,
  "Couldn't place your order. Please try again.",
);
export const updateOrderStatus = makeApiThunk(
  "customerOrder/updateOrderStatus",
  ({ id, status }) => orderApi.updateOrderStatus(id, status),
  "Failed to update order status",
);

const initialState = {
  orders: [],
  order: null, // the order shown on the tracking page
  loaded: false,
  loading: false,
  loadingOrder: false,
  creating: false,
  updatingStatus: false,
  error: null,
  orderError: null,
};

const orderSlice = createSlice({
  name: "customerOrder",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.orderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
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
        state.order = action.payload || null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loadingOrder = false;
        state.orderError = action.payload;
      })

      // PLACE ORDER
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // ADVANCE STATUS
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingStatus = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingStatus = false;
        state.orders = state.orders.map((o) => (o.id === action.payload.id ? action.payload : o));
        if (state.order?.id === action.payload.id) state.order = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingStatus = false;
        state.error = action.payload;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;
