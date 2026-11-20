import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import rootReducer from "./rootReducer";
import { configureAxios } from "@/api/axiosConfig";
import { logout } from "./slice/CustomerSlice/authSlice";
import { adminLogout } from "./slice/AdminSlice/authSlice";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Give the shared axios instance access to the two (separate) sessions.
// /admin/* requests get the admin token, everything else the customer token.
configureAxios({
  getCustomerToken: () => store.getState().customerAuth.token,
  getAdminToken: () => store.getState().adminAuth.token,
  onCustomerUnauthorized: () => store.dispatch(logout()),
  onAdminUnauthorized: () => store.dispatch(adminLogout()),
});

export const persistor = persistStore(store);

export default store;
