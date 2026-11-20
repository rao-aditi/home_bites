import { Routes, Route, Navigate } from "react-router-dom";
import AdminGuard from "./AdminGuard";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import CategoriesPage from "../pages/categories";
import FoodsPage from "../pages/foods";
import OffersPage from "../pages/offers";
import HomepagePage from "../pages/homepage";
import OrdersPage from "../pages/orders";
import CustomersPage from "../pages/customers";
import WishlistPage from "../pages/wishlist";
import ReviewsPage from "../pages/reviews";
import SettingsPage from "../pages/settings";

// Mounted at /admin/* by src/App.jsx.
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="foods" element={<FoodsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="homepage" element={<HomepagePage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
