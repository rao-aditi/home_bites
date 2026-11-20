import { createSlice } from "@reduxjs/toolkit";
import { adminFoodApi } from "@/api/adminApi/foodApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

const refreshList = (state) => fetchFoods(state.adminFood.lastParams);

export const fetchFoods = makeApiThunk(
  "adminFood/fetchFoods",
  adminFoodApi.list,
  "Failed to load foods",
);
// Compact list used to fill dropdowns on other pages (kept apart from the table's list).
export const fetchFoodOptions = makeApiThunk(
  "adminFood/fetchFoodOptions",
  adminFoodApi.list,
  "Failed to load foods",
  { condition: (_, { getState }) => !getState().adminFood.loadingOptions },
);
export const createFood = makeWriteThunk(
  "adminFood/createFood",
  adminFoodApi.create,
  "Failed to create food",
  refreshList,
);
export const updateFood = makeWriteThunk(
  "adminFood/updateFood",
  ({ id, ...data }) => adminFoodApi.update(id, data),
  "Failed to update food",
  refreshList,
);
export const deleteFood = makeWriteThunk(
  "adminFood/deleteFood",
  adminFoodApi.remove,
  "Failed to delete food",
  refreshList,
);
export const setFoodFlags = makeWriteThunk(
  "adminFood/setFoodFlags",
  ({ id, ...data }) => adminFoodApi.setFlags(id, data),
  "Failed to update food",
  refreshList,
);

const initialState = {
  list: null, // the server's list response (paginated: { items, pagination })
  lastParams: undefined,
  listRequestId: null,
  options: [],
  loadingOptions: false,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  toggling: false,
  error: null,
  mutationError: null,
};

const adminFoodSlice = createSlice({
  name: "adminFood",
  initialState,
  reducers: {
    clearFoodError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST (only the latest request may write, so stale responses are ignored)
      .addCase(fetchFoods.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      // OPTIONS
      .addCase(fetchFoodOptions.pending, (state) => {
        state.loadingOptions = true;
      })
      .addCase(fetchFoodOptions.fulfilled, (state, action) => {
        state.loadingOptions = false;
        state.options = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchFoodOptions.rejected, (state) => {
        state.loadingOptions = false;
      })

      .addCase(createFood.pending, (state) => {
        state.creating = true;
        state.mutationError = null;
      })
      .addCase(createFood.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createFood.rejected, (state, action) => {
        state.creating = false;
        state.mutationError = action.payload;
      })

      .addCase(updateFood.pending, (state) => {
        state.updating = true;
        state.mutationError = null;
      })
      .addCase(updateFood.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateFood.rejected, (state, action) => {
        state.updating = false;
        state.mutationError = action.payload;
      })

      .addCase(deleteFood.pending, (state) => {
        state.deleting = true;
        state.mutationError = null;
      })
      .addCase(deleteFood.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteFood.rejected, (state, action) => {
        state.deleting = false;
        state.mutationError = action.payload;
      })

      .addCase(setFoodFlags.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setFoodFlags.fulfilled, (state) => {
        state.toggling = false;
      })
      .addCase(setFoodFlags.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearFoodError } = adminFoodSlice.actions;
export default adminFoodSlice.reducer;
