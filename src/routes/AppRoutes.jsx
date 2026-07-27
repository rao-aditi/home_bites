import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/home/index";
import RestaurantsPage from "@/pages/restaurants";
import RestaurantDetailPage from "@/pages/restaurants.$id";
import FoodDetailPage from "@/pages/food.$id";
import CategoriesPage from "@/pages/categories";
import OffersPage from "@/pages/offers";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import PaymentPage from "@/pages/payment";
import OrdersPage from "@/pages/order/orders";
import OrderDetailPage from "@/pages/order/orders.$id";
import ProfilePage from "@/pages/profile";
import WishlistPage from "@/pages/wishlist";
import NotificationsPage from "@/pages/notifications";
import SearchPage from "@/pages/search";
import AboutPage from "@/pages/about";
import HelpPage from "@/pages/help";
import ContactPage from "@/pages/contact";
import OrderSuccessPage from "@/pages/order/order-success";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/restaurants" element={<RestaurantsPage />} />
      <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
      <Route path="/food/:id" element={<FoodDetailPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
