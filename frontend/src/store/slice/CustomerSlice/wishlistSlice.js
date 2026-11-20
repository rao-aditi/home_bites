import { createSlice } from "@reduxjs/toolkit";
import { wishlistApi } from "@/api/customerApi/wishlistApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { logout } from "./authSlice";

export const fetchWishlist = makeApiThunk(
  "customerWishlist/fetchWishlist",
  wishlistApi.getWishlist,
  "Failed to load wishlist",
  { condition: (_, { getState }) => !getState().customerWishlist.loading },
);
export const addToWishlist = makeApiThunk(
  "customerWishlist/addToWishlist",
  wishlistApi.addToWishlist,
  "Failed to add to wishlist",
);
export const removeFromWishlist = makeApiThunk(
  "customerWishlist/removeFromWishlist",
  wishlistApi.removeFromWishlist,
  "Failed to remove from wishlist",
);

const initialState = {
  wishlist: [], // array of wishlist items, each with its `food`
  loaded: false,
  loading: false,
  adding: false,
  removing: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "customerWishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.wishlist = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.adding = false;
        const i = state.wishlist.findIndex((w) => w.id === action.payload.id);
        if (i === -1) state.wishlist.push(action.payload);
        else state.wishlist[i] = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.removing = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removing = false;
        state.wishlist = state.wishlist.filter((w) => w.foodId !== action.payload?.foodId);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.removing = false;
        state.error = action.payload;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
