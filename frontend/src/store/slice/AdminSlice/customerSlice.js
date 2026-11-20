import { createSlice } from "@reduxjs/toolkit";
import { adminCustomerApi } from "@/api/adminApi/customerApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

export const fetchCustomers = makeApiThunk(
  "adminCustomer/fetchCustomers",
  adminCustomerApi.list,
  "Failed to load customers",
);
// Compact list used to fill dropdowns on other pages (kept apart from the table's list).
export const fetchCustomerOptions = makeApiThunk(
  "adminCustomer/fetchCustomerOptions",
  adminCustomerApi.list,
  "Failed to load customers",
  { condition: (_, { getState }) => !getState().adminCustomer.loadingOptions },
);
export const fetchCustomer = makeApiThunk(
  "adminCustomer/fetchCustomer",
  adminCustomerApi.get,
  "Failed to load customer",
);
export const setCustomerActive = makeWriteThunk(
  "adminCustomer/setCustomerActive",
  ({ id, ...data }) => adminCustomerApi.setActive(id, data),
  "Failed to update customer",
  (state) => fetchCustomers(state.adminCustomer.lastParams),
);

const initialState = {
  list: null, // { items, pagination }
  lastParams: undefined,
  listRequestId: null,
  options: [],
  customer: null,
  loading: false,
  loadingOptions: false,
  loadingCustomer: false,
  toggling: false,
  error: null,
  customerError: null,
  mutationError: null,
};

const customerSlice = createSlice({
  name: "adminCustomer",
  initialState,
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
      state.customerError = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchCustomers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      // OPTIONS
      .addCase(fetchCustomerOptions.pending, (state) => {
        state.loadingOptions = true;
      })
      .addCase(fetchCustomerOptions.fulfilled, (state, action) => {
        state.loadingOptions = false;
        state.options = action.payload?.items ?? [];
      })
      .addCase(fetchCustomerOptions.rejected, (state) => {
        state.loadingOptions = false;
      })

      // DETAILS
      .addCase(fetchCustomer.pending, (state, action) => {
        state.loadingCustomer = true;
        state.customerError = null;
        if (state.customer?.id !== action.meta.arg) state.customer = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.loadingCustomer = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.loadingCustomer = false;
        state.customerError = action.payload;
      })

      // ACTIVATE / DEACTIVATE
      .addCase(setCustomerActive.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setCustomerActive.fulfilled, (state, action) => {
        state.toggling = false;
        if (state.customer?.id === action.payload?.id) {
          state.customer = { ...state.customer, ...action.payload };
        }
      })
      .addCase(setCustomerActive.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
