import { createSlice } from "@reduxjs/toolkit";
import { adminBannerApi } from "@/api/adminApi/bannerApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

const refreshList = (state) => fetchBanners(state.adminBanner.lastParams);

export const fetchBanners = makeApiThunk(
  "adminBanner/fetchBanners",
  adminBannerApi.list,
  "Failed to load banners",
);
export const createBanner = makeWriteThunk(
  "adminBanner/createBanner",
  adminBannerApi.create,
  "Failed to create banner",
  refreshList,
);
export const updateBanner = makeWriteThunk(
  "adminBanner/updateBanner",
  ({ id, ...data }) => adminBannerApi.update(id, data),
  "Failed to update banner",
  refreshList,
);
export const deleteBanner = makeWriteThunk(
  "adminBanner/deleteBanner",
  adminBannerApi.remove,
  "Failed to delete banner",
  refreshList,
);
export const setBannerActive = makeWriteThunk(
  "adminBanner/setBannerActive",
  ({ id, ...data }) => adminBannerApi.setActive(id, data),
  "Failed to update banner",
  refreshList,
);

const initialState = {
  list: null, // the server's list response (paginated: { items, pagination })
  lastParams: undefined,
  listRequestId: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  toggling: false,
  error: null,
  mutationError: null,
};

const adminBannerSlice = createSlice({
  name: "adminBanner",
  initialState,
  reducers: {
    clearBannerError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST (only the latest request may write, so stale responses are ignored)
      .addCase(fetchBanners.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBanner.pending, (state) => {
        state.creating = true;
        state.mutationError = null;
      })
      .addCase(createBanner.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.creating = false;
        state.mutationError = action.payload;
      })

      .addCase(updateBanner.pending, (state) => {
        state.updating = true;
        state.mutationError = null;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.updating = false;
        state.mutationError = action.payload;
      })

      .addCase(deleteBanner.pending, (state) => {
        state.deleting = true;
        state.mutationError = null;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.deleting = false;
        state.mutationError = action.payload;
      })

      .addCase(setBannerActive.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setBannerActive.fulfilled, (state) => {
        state.toggling = false;
      })
      .addCase(setBannerActive.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearBannerError } = adminBannerSlice.actions;
export default adminBannerSlice.reducer;
