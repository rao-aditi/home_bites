import { createSlice } from "@reduxjs/toolkit";
import { adminCategoryApi } from "@/api/adminApi/categoryApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

const refreshList = (state) => fetchCategories(state.adminCategory.lastParams);

export const fetchCategories = makeApiThunk(
  "adminCategory/fetchCategories",
  adminCategoryApi.list,
  "Failed to load categories",
);
// Compact list used to fill dropdowns on other pages (kept apart from the table's list).
export const fetchCategoryOptions = makeApiThunk(
  "adminCategory/fetchCategoryOptions",
  adminCategoryApi.list,
  "Failed to load categories",
  { condition: (_, { getState }) => !getState().adminCategory.loadingOptions },
);
export const createCategory = makeWriteThunk(
  "adminCategory/createCategory",
  adminCategoryApi.create,
  "Failed to create category",
  refreshList,
);
export const updateCategory = makeWriteThunk(
  "adminCategory/updateCategory",
  ({ id, ...data }) => adminCategoryApi.update(id, data),
  "Failed to update category",
  refreshList,
);
export const deleteCategory = makeWriteThunk(
  "adminCategory/deleteCategory",
  adminCategoryApi.remove,
  "Failed to delete category",
  refreshList,
);
export const setCategoryActive = makeWriteThunk(
  "adminCategory/setCategoryActive",
  ({ id, ...data }) => adminCategoryApi.setActive(id, data),
  "Failed to update category",
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

const adminCategorySlice = createSlice({
  name: "adminCategory",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST (only the latest request may write, so stale responses are ignored)
      .addCase(fetchCategories.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      // OPTIONS
      .addCase(fetchCategoryOptions.pending, (state) => {
        state.loadingOptions = true;
      })
      .addCase(fetchCategoryOptions.fulfilled, (state, action) => {
        state.loadingOptions = false;
        state.options = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchCategoryOptions.rejected, (state) => {
        state.loadingOptions = false;
      })

      .addCase(createCategory.pending, (state) => {
        state.creating = true;
        state.mutationError = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.creating = false;
        state.mutationError = action.payload;
      })

      .addCase(updateCategory.pending, (state) => {
        state.updating = true;
        state.mutationError = null;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updating = false;
        state.mutationError = action.payload;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.deleting = true;
        state.mutationError = null;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleting = false;
        state.mutationError = action.payload;
      })

      .addCase(setCategoryActive.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setCategoryActive.fulfilled, (state) => {
        state.toggling = false;
      })
      .addCase(setCategoryActive.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearCategoryError } = adminCategorySlice.actions;
export default adminCategorySlice.reducer;
