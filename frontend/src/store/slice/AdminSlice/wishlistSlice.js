import { createSlice } from "@reduxjs/toolkit";
import { adminWishlistApi } from "@/api/adminApi/wishlistApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

// Read-only: admins monitor wishlists but never edit a customer's personal list.
export const fetchWishlist = makeApiThunk(
  "adminWishlist/fetchWishlist",
  adminWishlistApi.list,
  "Failed to load wishlist",
);
export const fetchWishlistStats = makeApiThunk(
  "adminWishlist/fetchWishlistStats",
  adminWishlistApi.stats,
  "Failed to load wishlist statistics",
);

const initialState = {
  list: null, // { items, pagination }
  listRequestId: null,
  stats: null,
  loading: false,
  loadingStats: false,
  error: null,
  statsError: null,
};

const wishlistSlice = createSlice({
  name: "adminWishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchWishlistStats.pending, (state) => {
        state.loadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchWishlistStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchWishlistStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.statsError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
