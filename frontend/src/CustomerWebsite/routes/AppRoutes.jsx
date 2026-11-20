import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/CustomerWebsite/pages/home/index";
import MenuPage from "@/CustomerWebsite/pages/menu";
import FoodDetailPage from "@/CustomerWebsite/pages/food.$id";
import CategoriesPage from "@/CustomerWebsite/pages/categories";
import OffersPage from "@/CustomerWebsite/pages/offers";
import CartPage from "@/CustomerWebsite/pages/cart";
import CheckoutPage from "@/CustomerWebsite/pages/checkout";
import PaymentPage from "@/CustomerWebsite/pages/payment";
import OrdersPage from "@/CustomerWebsite/pages/order/orders";
import OrderDetailPage from "@/CustomerWebsite/pages/order/orders.$id";
import ProfilePage from "@/CustomerWebsite/pages/profile";
import WishlistPage from "@/CustomerWebsite/pages/wishlist";
import NotificationsPage from "@/CustomerWebsite/pages/notifications";
import SearchPage from "@/CustomerWebsite/pages/search";
import AboutPage from "@/CustomerWebsite/pages/about";
import HelpPage from "@/CustomerWebsite/pages/help";
import ContactPage from "@/CustomerWebsite/pages/contact";
import OrderSuccessPage from "@/CustomerWebsite/pages/order/order-success";
import AddressesPage from "@/CustomerWebsite/pages/addresses";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<MenuPage />} />
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
      <Route path="/addresses" element={<AddressesPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
