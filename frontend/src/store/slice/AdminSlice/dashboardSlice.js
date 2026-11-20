import { createSlice } from "@reduxjs/toolkit";
import { adminDashboardApi } from "@/api/adminApi/dashboardApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

export const fetchDashboard = makeApiThunk(
  "adminDashboard/fetchDashboard",
  adminDashboardApi.getDashboard,
  "Failed to load dashboard",
);

const initialState = {
  dashboard: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminLogout, () => initialState);
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
