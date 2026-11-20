import { createSlice } from "@reduxjs/toolkit";
import { bannerApi } from "@/api/customerApi/bannerApi";
import { makeApiThunk } from "@/store/makeApiThunk";

// params: { type: "hero" | "promo" } — results are kept per type.
export const fetchBanners = makeApiThunk(
  "customerBanner/fetchBanners",
  bannerApi.getBanners,
  "Failed to load banners",
);

const initialState = {
  banners: {}, // { [type]: banner[] }
  loading: false,
  error: null,
  pending: 0, // in-flight requests (hero + promo are fetched together)
};

const typeKey = (arg) => arg?.type || "all";

const bannerSlice = createSlice({
  name: "customerBanner",
  initialState,
  reducers: {
    clearBannerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.pending += 1;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.pending -= 1;
        state.loading = state.pending > 0;
        state.banners[typeKey(action.meta.arg)] = action.payload || [];
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.pending -= 1;
        state.loading = state.pending > 0;
        state.error = action.payload;
      });
  },
});

export const { clearBannerError } = bannerSlice.actions;
export default bannerSlice.reducer;
