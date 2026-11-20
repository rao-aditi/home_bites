import { createSlice } from "@reduxjs/toolkit";
import { offerApi } from "@/api/customerApi/offerApi";
import { makeApiThunk } from "@/store/makeApiThunk";

export const fetchOffers = makeApiThunk(
  "customerOffer/fetchOffers",
  offerApi.getOffers,
  "Failed to load offers",
  { condition: (_, { getState }) => !getState().customerOffer.loading },
);
export const validateOffer = makeApiThunk(
  "customerOffer/validateOffer",
  offerApi.validateOffer,
  "Invalid coupon",
);

const initialState = {
  offers: [],
  loaded: false,
  loading: false,
  validating: false,
  error: null,
  validationError: null,
};

const offerSlice = createSlice({
  name: "customerOffer",
  initialState,
  reducers: {
    clearOfferError: (state) => {
      state.error = null;
      state.validationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.offers = action.payload || [];
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // VALIDATE COUPON
      .addCase(validateOffer.pending, (state) => {
        state.validating = true;
        state.validationError = null;
      })
      .addCase(validateOffer.fulfilled, (state) => {
        state.validating = false;
      })
      .addCase(validateOffer.rejected, (state, action) => {
        state.validating = false;
        state.validationError = action.payload;
      });
  },
});

export const { clearOfferError } = offerSlice.actions;
export default offerSlice.reducer;
