import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart } from "@/store/slice/CustomerSlice/cartSlice";
import { fetchWishlist } from "@/store/slice/CustomerSlice/wishlistSlice";
import { fetchNotifications } from "@/store/slice/CustomerSlice/notificationSlice";
import { fetchBusiness } from "@/store/slice/CustomerSlice/businessSlice";
import { Navbar } from "@/CustomerWebsite/components/layout/Navbar";
import { Footer } from "@/CustomerWebsite/components/layout/Footer";

export default function AppShell() {
  const dispatch = useDispatch();

  // Everything the signed-in customer needs on every page (navbar badges, footer, card
  // buttons) is loaded once here; pages that show more data load it themselves.
  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
    dispatch(fetchNotifications());
    dispatch(fetchBusiness());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
