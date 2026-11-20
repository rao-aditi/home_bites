import { createSlice } from "@reduxjs/toolkit";
import { categoryApi } from "@/api/customerApi/categoryApi";
import { makeApiThunk } from "@/store/makeApiThunk";

export const fetchCategories = makeApiThunk(
  "customerCategory/fetchCategories",
  categoryApi.getCategories,
  "Failed to load categories",
  { condition: (_, { getState }) => !getState().customerCategory.loading },
);

const initialState = {
  categories: [],
  loaded: false,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "customerCategory",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
