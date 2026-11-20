import { combineReducers } from "@reduxjs/toolkit";
import { createTransform, persistReducer } from "redux-persist";
import storageImport from "redux-persist/lib/storage";
import uiReducer from "./slice/uiSlice";
import customerAuthReducer from "./slice/CustomerSlice/authSlice";
import customerBusinessReducer from "./slice/CustomerSlice/businessSlice";
import customerCategoryReducer from "./slice/CustomerSlice/categorySlice";
import customerFoodReducer from "./slice/CustomerSlice/foodSlice";
import customerCartReducer from "./slice/CustomerSlice/cartSlice";
import customerWishlistReducer from "./slice/CustomerSlice/wishlistSlice";
import customerOfferReducer from "./slice/CustomerSlice/offerSlice";
import customerAddressReducer from "./slice/CustomerSlice/addressSlice";
import customerOrderReducer from "./slice/CustomerSlice/orderSlice";
import customerNotificationReducer from "./slice/CustomerSlice/notificationSlice";
import customerBannerReducer from "./slice/CustomerSlice/bannerSlice";
import customerSectionReducer from "./slice/CustomerSlice/sectionSlice";
import adminAuthReducer from "./slice/AdminSlice/authSlice";
import adminDashboardReducer from "./slice/AdminSlice/dashboardSlice";
import adminCategoryReducer from "./slice/AdminSlice/categorySlice";
import adminFoodReducer from "./slice/AdminSlice/foodSlice";
import adminOfferReducer from "./slice/AdminSlice/offerSlice";
import adminBannerReducer from "./slice/AdminSlice/bannerSlice";
import adminSectionReducer from "./slice/AdminSlice/sectionSlice";
import adminOrderReducer from "./slice/AdminSlice/orderSlice";
import adminCustomerReducer from "./slice/AdminSlice/customerSlice";
import adminWishlistReducer from "./slice/AdminSlice/wishlistSlice";
import adminReviewReducer from "./slice/AdminSlice/reviewSlice";
import adminSettingsReducer from "./slice/AdminSlice/settingsSlice";
import adminUploadReducer from "./slice/AdminSlice/uploadSlice";

const storage = storageImport.default || storageImport;

const sessionTransform = createTransform(
  (inbound) => ({ user: inbound.user, token: inbound.token }),
  (outbound, key) => ({
    ...(key === "adminAuth" ? adminAuthReducer : customerAuthReducer)(undefined, { type: "@@init" }),
    user: outbound.user,
    token: outbound.token,
  }),
  { whitelist: ["customerAuth", "adminAuth"] },
);

const migrate = (state) => {
  if (state && state.auth) {
    const { auth, ...rest } = state;
    const target = auth.user?.role === "admin" ? "adminAuth" : "customerAuth";
    return Promise.resolve({ ...rest, [target]: { user: auth.user, token: auth.token } });
  }
  return Promise.resolve(state);
};

const persistConfig = {
  key: "homebites-root",
  storage,
  whitelist: ["customerAuth", "adminAuth", "ui"],
  transforms: [sessionTransform],
  version: 2,
  migrate,
};

const rootReducer = combineReducers({
  ui: uiReducer,
  customerAuth: customerAuthReducer,
  customerBusiness: customerBusinessReducer,
  customerCategory: customerCategoryReducer,
  customerFood: customerFoodReducer,
  customerCart: customerCartReducer,
  customerWishlist: customerWishlistReducer,
  customerOffer: customerOfferReducer,
  customerAddress: customerAddressReducer,
  customerOrder: customerOrderReducer,
  customerNotification: customerNotificationReducer,
  customerBanner: customerBannerReducer,
  customerSection: customerSectionReducer,
  adminAuth: adminAuthReducer,
  adminDashboard: adminDashboardReducer,
  adminCategory: adminCategoryReducer,
  adminFood: adminFoodReducer,
  adminOffer: adminOfferReducer,
  adminBanner: adminBannerReducer,
  adminSection: adminSectionReducer,
  adminOrder: adminOrderReducer,
  adminCustomer: adminCustomerReducer,
  adminWishlist: adminWishlistReducer,
  adminReview: adminReviewReducer,
  adminSettings: adminSettingsReducer,
  adminUpload: adminUploadReducer,
});

export default persistReducer(persistConfig, rootReducer);
