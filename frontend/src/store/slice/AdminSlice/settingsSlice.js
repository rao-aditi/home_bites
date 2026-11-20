import { createSlice } from "@reduxjs/toolkit";
import { adminSettingsApi } from "@/api/adminApi/settingsApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { adminLogout } from "./authSlice";

export const fetchSettings = makeApiThunk(
  "adminSettings/fetchSettings",
  adminSettingsApi.get,
  "Failed to load settings",
);
export const updateSettings = makeApiThunk(
  "adminSettings/updateSettings",
  adminSettingsApi.update,
  "Failed to save settings",
);

const initialState = {
  settings: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null,
};

const settingsSlice = createSlice({
  name: "adminSettings",
  initialState,
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSettings.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.settings = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload;
      })

      .addCase(adminLogout, () => initialState);
  },
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
