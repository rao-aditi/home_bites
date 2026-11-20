import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMapPin, FiPackage, FiHeart, FiBell, FiLogOut, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { selectCurrentUser, logout } from "@/store/slice/CustomerSlice/authSlice";
import { fetchOrders } from "@/store/slice/CustomerSlice/orderSlice";
import { fetchAddresses } from "@/store/slice/CustomerSlice/addressSlice";
import { fetchWishlist } from "@/store/slice/CustomerSlice/wishlistSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const orders = useSelector((state) => state.customerOrder.orders);
  const addresses = useSelector((state) => state.customerAddress.addresses);
  const wishlist = useSelector((state) => state.customerWishlist.wishlist);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchAddresses());
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleLogout = () => {
    // Logging out also resets every customer slice (they all listen for `logout`).
    dispatch(logout());
    toast.success("Signed out successfully!");
    navigate("/");
  };

  const displayUser = user || {
    name: "Guest",
    email: "",
    phone: "",
    avatar: null,
  };

  const tiles = [
    { to: "/orders", icon: FiPackage, label: "My orders", count: orders.length },
    { to: "/addresses", icon: FiMapPin, label: "Saved addresses", count: addresses.length },
    { to: "/wishlist", icon: FiHeart, label: "Wishlist", count: wishlist.length },
    { to: "/notifications", icon: FiBell, label: "Notifications" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="flex flex-col items-start gap-4 rounded-3xl gradient-warm p-6 text-primary-foreground shadow-elegant md:flex-row md:items-center md:p-8">
        {displayUser.avatar ? (
          <img
            src={displayUser.avatar}
            alt={displayUser.name}
            className="h-20 w-20 rounded-full border-2 border-white/40 object-cover shadow-soft"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/25 text-3xl backdrop-blur">
            <FiUser />
          </div>
        )}
        <div>
          <div className="text-2xl font-extrabold">{displayUser.name}</div>
          <div className="opacity-90">
            {displayUser.email}
            {displayUser.phone && ` • ${displayUser.phone}`}
          </div>
        </div>
        <button className="ml-auto rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur hover:bg-white/30 transition">
          Edit profile
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link
            key={t.label}
            to={t.to}
            className="group flex items-center gap-3 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/40 hover:shadow-elegant"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-primary group-hover:scale-110 transition">
              <t.icon />
            </div>
            <div>
              <div className="font-bold">{t.label}</div>
              {"count" in t && (
                <div className="text-xs text-muted-foreground">
                  {t.count} item{t.count !== 1 && "s"}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-bold hover:border-destructive hover:text-destructive transition"
      >
        <FiLogOut /> Logout
      </button>
    </div>
  );
}
