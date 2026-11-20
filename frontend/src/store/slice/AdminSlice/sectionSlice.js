import { createSlice } from "@reduxjs/toolkit";
import { adminSectionApi } from "@/api/adminApi/sectionApi";
import { makeApiThunk, makeWriteThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

const refreshList = (state) => fetchSections(state.adminSection.lastParams);

export const fetchSections = makeApiThunk(
  "adminSection/fetchSections",
  adminSectionApi.list,
  "Failed to load sections",
);
export const createSection = makeWriteThunk(
  "adminSection/createSection",
  adminSectionApi.create,
  "Failed to create section",
  refreshList,
);
export const updateSection = makeWriteThunk(
  "adminSection/updateSection",
  ({ id, ...data }) => adminSectionApi.update(id, data),
  "Failed to update section",
  refreshList,
);
export const deleteSection = makeWriteThunk(
  "adminSection/deleteSection",
  adminSectionApi.remove,
  "Failed to delete section",
  refreshList,
);
export const setSectionVisible = makeWriteThunk(
  "adminSection/setSectionVisible",
  ({ id, ...data }) => adminSectionApi.setVisible(id, data),
  "Failed to update section",
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

const adminSectionSlice = createSlice({
  name: "adminSection",
  initialState,
  reducers: {
    clearSectionError: (state) => {
      state.error = null;
      state.mutationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LIST (only the latest request may write, so stale responses are ignored)
      .addCase(fetchSections.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.lastParams = action.meta.arg;
        state.listRequestId = action.meta.requestId;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSections.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return;
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSection.pending, (state) => {
        state.creating = true;
        state.mutationError = null;
      })
      .addCase(createSection.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createSection.rejected, (state, action) => {
        state.creating = false;
        state.mutationError = action.payload;
      })

      .addCase(updateSection.pending, (state) => {
        state.updating = true;
        state.mutationError = null;
      })
      .addCase(updateSection.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.updating = false;
        state.mutationError = action.payload;
      })

      .addCase(deleteSection.pending, (state) => {
        state.deleting = true;
        state.mutationError = null;
      })
      .addCase(deleteSection.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.deleting = false;
        state.mutationError = action.payload;
      })

      .addCase(setSectionVisible.pending, (state) => {
        state.toggling = true;
        state.mutationError = null;
      })
      .addCase(setSectionVisible.fulfilled, (state) => {
        state.toggling = false;
      })
      .addCase(setSectionVisible.rejected, (state, action) => {
        state.toggling = false;
        state.mutationError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearSectionError } = adminSectionSlice.actions;
export default adminSectionSlice.reducer;
