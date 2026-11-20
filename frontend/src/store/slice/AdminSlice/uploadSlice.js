import { createSlice } from "@reduxjs/toolkit";
import { adminUploadApi } from "@/api/adminApi/uploadApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

// Resolves with { urls: string[] } — the caller puts the URLs into its own form state.
export const uploadImages = makeApiThunk(
  "adminUpload/uploadImages",
  adminUploadApi.uploadImages,
  "Upload failed",
);

const initialState = {
  uploading: false,
  error: null,
};

const uploadSlice = createSlice({
  name: "adminUpload",
  initialState,
  reducers: {
    clearUploadError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state) => {
        state.uploading = false;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(adminLogout, () => initialState);
  },
});

export const { clearUploadError } = uploadSlice.actions;
export default uploadSlice.reducer;
