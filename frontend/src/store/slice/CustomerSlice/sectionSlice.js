import { createSlice } from "@reduxjs/toolkit";
import { sectionApi } from "@/api/customerApi/sectionApi";
import { makeApiThunk } from "@/store/makeApiThunk";

export const fetchSections = makeApiThunk(
  "customerSection/fetchSections",
  sectionApi.getSections,
  "Failed to load homepage sections",
  { condition: (_, { getState }) => !getState().customerSection.loading },
);

const initialState = {
  sections: [],
  loaded: false,
  loading: false,
  error: null,
};

const sectionSlice = createSlice({
  name: "customerSection",
  initialState,
  reducers: {
    clearSectionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.sections = action.payload || [];
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSectionError } = sectionSlice.actions;
export default sectionSlice.reducer;
