import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  location: "San Francisco, CA",
  recentlyViewed: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setLocation(state, action) {
      state.location = action.payload;
    },
    addRecentlyViewed(state, action) {
      const id = action.payload;
      state.recentlyViewed = [
        id,
        ...state.recentlyViewed.filter((i) => i !== id),
      ].slice(0, 8);
    },
  },
});

export const { toggleTheme, setTheme, setLocation, addRecentlyViewed } =
  uiSlice.actions;
export default uiSlice.reducer;

export const selectTheme = (state) => state.ui.theme;
export const selectLocation = (state) => state.ui.location;
export const selectRecentlyViewed = (state) => state.ui.recentlyViewed;
