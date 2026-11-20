import { createSlice } from "@reduxjs/toolkit";
import { adminReviewApi } from "@/api/adminApi/reviewApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

const refreshList = (state) => fetchReviews(state.adminReview.lastParams);

export const fetchReviews = makeApiThunk(
  "adminReview/fetchReviews",
  adminReviewApi.list,
  "Failed to load reviews",
);
export const setReviewHidden = makeWriteThunk(
  "adminReview/setReviewHidden",
  ({ id, ...data }) => adminReviewApi.setHidden(id, data),
  "Failed to update review",
  refreshList,
);
export const deleteReview = makeWriteThunk(
  "adminReview/deleteReview",
  adminReviewApi.remove,
  "Failed to delete review",
  refreshList,
);

const initialState = {
  list: null, // { items, pagination, summary }
  lastParams: undefined,
  listRequestId: null,
  loading: false,
  toggling: false,
  deleting: false,
  error: null,
  mutationError: null,
};

const reviewSlice = createSlice({
  name: "adminReview",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(setReviewHidden.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setReviewHidden.fulfilled, (state) => {
        state.toggling = false;
      })
      .addCase(setReviewHidden.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(deleteReview.pending, (state) => {
        state.deleting = true;
        state.mutationError = null;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleting = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
