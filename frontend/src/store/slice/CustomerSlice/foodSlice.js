import { createSlice } from "@reduxjs/toolkit";
import { foodApi } from "@/api/customerApi/foodApi";
import { makeApiThunk } from "@/store/makeApiThunk";

export const fetchFoods = makeApiThunk(
  "customerFood/fetchFoods",
  foodApi.getFoods,
  "Failed to load foods",
);
export const fetchFood = makeApiThunk(
  "customerFood/fetchFood",
  foodApi.getFood,
  "Failed to load this dish",
);

const initialState = {
  foods: [],
  food: null,
  loaded: false, // a foods list has been received at least once
  loading: false,
  loadingFood: false,
  error: null,
  foodError: null,
  // Only the latest request may write the list, so a slow response for an old
  // search/filter can never overwrite a newer one.
  listRequestId: null,
};

const foodSlice = createSlice({
  name: "customerFood",
  initialState,
  reducers: {
    clearFoodError: (state) => {
      state.error = null;
      state.foodError = null;
    },
    clearFood: (state) => {
      state.food = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FOOD LIST
      .addCase(fetchFoods.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.loaded = true;
        state.foods = action.payload || [];
      })
      .addCase(fetchFoods.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      // FOOD DETAILS
      .addCase(fetchFood.pending, (state, action) => {
        state.loadingFood = true;
        state.foodError = null;
        if (state.food?.id !== action.meta.arg) state.food = null;
      })
      .addCase(fetchFood.fulfilled, (state, action) => {
        state.loadingFood = false;
        state.food = action.payload || null;
      })
      .addCase(fetchFood.rejected, (state, action) => {
        state.loadingFood = false;
        state.foodError = action.payload;
      });
  },
});

export const { clearFoodError, clearFood } = foodSlice.actions;
export default foodSlice.reducer;
