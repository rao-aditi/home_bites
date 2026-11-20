import { createSlice } from "@reduxjs/toolkit";
import { cartApi } from "@/api/customerApi/cartApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { logout } from "./authSlice";
import { createOrder } from "./orderSlice";

export const fetchCart = makeApiThunk(
  "customerCart/fetchCart",
  cartApi.getCart,
  "Failed to fetch cart",
  { condition: (_, { getState }) => !getState().customerCart.loading },
);
export const addToCart = makeApiThunk(
  "customerCart/addToCart",
  cartApi.addToCart,
  "Failed to add item to cart",
);
export const updateCartItem = makeApiThunk(
  "customerCart/updateCartItem",
  ({ id, action }) => cartApi.updateCartItem(id, action),
  "Failed to update cart",
);
export const removeCartItem = makeApiThunk(
  "customerCart/removeCartItem",
  cartApi.removeCartItem,
  "Failed to remove cart item",
);
export const clearCartItems = makeApiThunk(
  "customerCart/clearCartItems",
  cartApi.clearCart,
  "Failed to clear cart",
);

const initialState = {
  cart: [], // array of cart items, each with its `food`
  loaded: false,
  loading: false,
  adding: false,
  updating: false,
  removing: false,
  clearing: false,
  error: null,
};

const upsert = (list, item) => {
  const i = list.findIndex((c) => c.id === item.id);
  if (i === -1) list.push(item);
  else list[i] = item;
};

const cartSlice = createSlice({
  name: "customerCart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.cart = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD TO CART (server upserts + increments quantity)
      .addCase(addToCart.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.adding = false;
        upsert(state.cart, action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      // UPDATE QUANTITY (server returns {removed:true,id} when it drops to 0)
      .addCase(updateCartItem.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload?.removed) {
          state.cart = state.cart.filter((c) => c.id !== action.payload.id);
        } else {
          upsert(state.cart, action.payload);
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // REMOVE ITEM
      .addCase(removeCartItem.pending, (state) => {
        state.removing = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.removing = false;
        state.cart = state.cart.filter((c) => c.id !== action.payload?.id);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.removing = false;
        state.error = action.payload;
      })

      // CLEAR CART
      .addCase(clearCartItems.pending, (state) => {
        state.clearing = true;
        state.error = null;
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.clearing = false;
        state.cart = [];
      })
      .addCase(clearCartItems.rejected, (state, action) => {
        state.clearing = false;
        state.error = action.payload;
      })

      // The server empties the cart when an order is placed.
      .addCase(createOrder.fulfilled, (state) => {
        state.cart = [];
      })
      .addCase(logout, () => initialState);
  },
});

export const { clearCartError, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
