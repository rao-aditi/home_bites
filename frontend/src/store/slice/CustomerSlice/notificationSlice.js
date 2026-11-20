import { createSlice } from "@reduxjs/toolkit";
import { notificationApi } from "@/api/customerApi/notificationApi";
import { makeApiThunk } from "@/store/makeApiThunk";
import { logout } from "./authSlice";

export const fetchNotifications = makeApiThunk(
  "customerNotification/fetchNotifications",
  notificationApi.getNotifications,
  "Failed to load notifications",
  { condition: (_, { getState }) => !getState().customerNotification.loading },
);
export const markNotificationRead = makeApiThunk(
  "customerNotification/markNotificationRead",
  notificationApi.markNotificationRead,
  "Failed to update notification",
);

const initialState = {
  notifications: [],
  loaded: false,
  loading: false,
  marking: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "customerNotification",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.notifications = action.payload || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(markNotificationRead.pending, (state) => {
        state.marking = true;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.marking = false;
        state.notifications = state.notifications.map((n) =>
          n.id === action.payload.id ? action.payload : n,
        );
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.marking = false;
        state.error = action.payload;
      })

      .addCase(logout, () => initialState);
  },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
