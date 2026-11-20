import { createSlice } from "@reduxjs/toolkit";
import { adminAuthApi } from "@/api/adminApi/authApi";
import { makeApiThunk } from "@/store/makeApiThunk";

// Admin Panel session. Completely separate from the Customer Website's `customerAuth`.
export const loginAdmin = makeApiThunk(
  "adminAuth/login",
  adminAuthApi.login,
  "Login failed",
);
// Re-checks the admin role against the database (the real enforcement is server-side).
export const fetchAdminMe = makeApiThunk(
  "adminAuth/fetchAdminMe",
  adminAuthApi.getMe,
  "Not authorised",
);

const initialState = {
  user: null,
  token: null,
  checked: false, // role verified against the server in this browser session (not persisted)
  loggingIn: false,
  checking: false,
  error: null,
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    clearAdminAuthError(state) {
      state.error = null;
    },
    adminLogout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginAdmin.pending, (state) => {
        state.loggingIn = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loggingIn = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.checked = true; // the server only issues admin tokens to admins
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loggingIn = false;
        state.error = action.payload;
      })

      // ROLE CHECK
      .addCase(fetchAdminMe.pending, (state) => {
        state.checking = true;
        state.error = null;
      })
      .addCase(fetchAdminMe.fulfilled, (state, action) => {
        state.checking = false;
        state.user = action.payload.user;
        state.checked = true;
      })
      .addCase(fetchAdminMe.rejected, (state, action) => {
        state.checking = false;
        state.checked = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminAuthError, adminLogout } = authSlice.actions;
export default authSlice.reducer;

export const selectAdminUser = (state) => state.adminAuth.user;
export const selectIsAdminAuthenticated = (state) => Boolean(state.adminAuth.token);
