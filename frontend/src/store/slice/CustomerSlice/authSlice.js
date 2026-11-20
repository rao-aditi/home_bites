import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/api/customerApi/authApi";
import { makeApiThunk } from "@/store/makeApiThunk";

// Customer Website session. Completely separate from the Admin Panel's `adminAuth`.
export const loginUser = makeApiThunk("customerAuth/login", authApi.login, "Login failed");
export const registerUser = makeApiThunk(
  "customerAuth/register",
  authApi.register,
  "Registration failed",
);
export const fetchCurrentUser = makeApiThunk(
  "customerAuth/fetchCurrentUser",
  authApi.getMe,
  "Failed to load profile",
);

const initialState = {
  user: null,
  token: null,
  loggingIn: false,
  registering: false,
  fetchingUser: false,
  error: null,
};

const authSlice = createSlice({
  name: "customerAuth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearAuthError(state) {
      state.error = null;
    },
    logout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loggingIn = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loggingIn = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loggingIn = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.registering = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registering = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload;
      })

      // CURRENT USER
      .addCase(fetchCurrentUser.pending, (state) => {
        state.fetchingUser = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.fetchingUser = false;
        state.user = action.payload.user || state.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.fetchingUser = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.customerAuth.user;
export const selectIsAuthenticated = (state) => Boolean(state.customerAuth.token);
