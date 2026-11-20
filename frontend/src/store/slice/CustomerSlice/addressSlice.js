import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/helpers/apiError";
import { addressApi } from "@/api/customerApi/addressApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { logout } from "./authSlice";

export const fetchAddresses = makeApiThunk(
  "customerAddress/fetchAddresses",
  addressApi.getAddresses,
  "Failed to load addresses",
  { condition: (_, { getState }) => !getState().customerAddress.loading },
);
export const addAddress = makeApiThunk(
  "customerAddress/addAddress",
  addressApi.addAddress,
  "Failed to add address",
);
export const updateAddress = makeApiThunk(
  "customerAddress/updateAddress",
  ({ id, ...data }) => addressApi.updateAddress(id, data),
  "Failed to update address",
);
export const setDefaultAddress = makeApiThunk(
  "customerAddress/setDefaultAddress",
  addressApi.setDefaultAddress,
  "Failed to set default address",
);
// The server promotes another address to default when the default one is deleted,
// so the list is re-fetched afterwards to pick that up.
export const deleteAddress = createAsyncThunk(
  "customerAddress/deleteAddress",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await addressApi.deleteAddress(id);
      dispatch(fetchAddresses());
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to delete address"));
    }
  },
);

const initialState = {
  addresses: [],
  loaded: false,
  loading: false,
  adding: false,
  updating: false,
  settingDefault: false,
  deleting: false,
  error: null,
};

const addressSlice = createSlice({
  name: "customerAddress",
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.addresses = action.payload || [];
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD (a new address always becomes the default on the server)
      .addCase(addAddress.pending, (state) => {
        state.adding = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.adding = false;
        state.addresses = state.addresses.map((a) => ({ ...a, isDefault: false }));
        state.addresses.push(action.payload);
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.adding = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateAddress.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.updating = false;
        state.addresses = state.addresses.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        );
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // SET DEFAULT
      .addCase(setDefaultAddress.pending, (state) => {
        state.settingDefault = true;
        state.error = null;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.settingDefault = false;
        state.addresses = state.addresses.map((a) => ({
          ...a,
          isDefault: a.id === action.payload.id,
        }));
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        state.settingDefault = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteAddress.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.deleting = false;
        state.addresses = state.addresses.filter((a) => a.id !== action.payload?.id);
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
