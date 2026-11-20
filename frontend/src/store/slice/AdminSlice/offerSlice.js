import { createSlice } from "@reduxjs/toolkit";
import { adminOfferApi } from "@/api/adminApi/offerApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

const refreshList = (state) => fetchOffers(state.adminOffer.lastParams);

export const fetchOffers = makeApiThunk(
  "adminOffer/fetchOffers",
  adminOfferApi.list,
  "Failed to load offers",
);
export const createOffer = makeWriteThunk(
  "adminOffer/createOffer",
  adminOfferApi.create,
  "Failed to create offer",
  refreshList,
);
export const updateOffer = makeWriteThunk(
  "adminOffer/updateOffer",
  ({ id, ...data }) => adminOfferApi.update(id, data),
  "Failed to update offer",
  refreshList,
);
export const deleteOffer = makeWriteThunk(
  "adminOffer/deleteOffer",
  adminOfferApi.remove,
  "Failed to delete offer",
  refreshList,
);
export const setOfferActive = makeWriteThunk(
  "adminOffer/setOfferActive",
  ({ id, ...data }) => adminOfferApi.setActive(id, data),
  "Failed to update offer",
  refreshList,
);

const initialState = {
  list: null, // the server's list response (paginated: { items, pagination })
  lastParams: undefined,
  listRequestId: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  toggling: false,
  error: null,
  mutationError: null,
};

const adminOfferSlice = createSlice({
  name: "adminOffer",
  initialState,
  reducers: {
    clearOfferError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST (only the latest request may write, so stale responses are ignored)
      .addCase(fetchOffers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOffer.pending, (state) => {
        state.creating = true;
        state.mutationError = null;
      })
      .addCase(createOffer.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.creating = false;
        state.mutationError = action.payload;
      })

      .addCase(updateOffer.pending, (state) => {
        state.updating = true;
        state.mutationError = null;
      })
      .addCase(updateOffer.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.updating = false;
        state.mutationError = action.payload;
      })

      .addCase(deleteOffer.pending, (state) => {
        state.deleting = true;
        state.mutationError = null;
      })
      .addCase(deleteOffer.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.deleting = false;
        state.mutationError = action.payload;
      })

      .addCase(setOfferActive.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setOfferActive.fulfilled, (state) => {
        state.toggling = false;
      })
      .addCase(setOfferActive.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearOfferError } = adminOfferSlice.actions;
export default adminOfferSlice.reducer;
