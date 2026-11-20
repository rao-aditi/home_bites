import { createSlice } from "@reduxjs/toolkit";
import { businessApi } from "@/api/customerApi/businessApi";
import { makeApiThunk } from "@/store/makeApiThunk";

export const fetchBusiness = makeApiThunk(
  "customerBusiness/fetchBusiness",
  businessApi.getBusiness,
  "Failed to load business info",
  { condition: (_, { getState }) => !getState().customerBusiness.loading },
);

const initialState = {
  business: null,
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: "customerBusiness",
  initialState,
  reducers: {
    clearBusinessError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.business = action.payload || null;
      })
      .addCase(fetchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBusinessError } = businessSlice.actions;
export default businessSlice.reducer;
