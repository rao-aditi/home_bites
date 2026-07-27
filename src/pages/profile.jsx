import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { FiMapPin, FiPackage, FiHeart, FiBell, FiLogOut, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Signed out successfully!");
    navigate({ to: "/" });
  };

  const user = state.user || {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 415 555 0121",
    avatar: null,
  };

  const tiles = [
    { to: "/orders", icon: FiPackage, label: "My orders", count: state.orders.length },
    { to: "/addresses", icon: FiMapPin, label: "Saved addresses", count: state.addresses.length },
    { to: "/wishlist", icon: FiHeart, label: "Wishlist", count: state.wishlist.length },
    { to: "/notifications", icon: FiBell, label: "Notifications" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="flex flex-col items-start gap-4 rounded-3xl gradient-warm p-6 text-primary-foreground shadow-elegant md:flex-row md:items-center md:p-8">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-20 w-20 rounded-full border-2 border-white/40 object-cover shadow-soft"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white/25 text-3xl backdrop-blur">
            <FiUser />
          </div>
        )}
        <div>
          <div className="text-2xl font-extrabold">{user.name}</div>
          <div className="opacity-90">
            {user.email} • {user.phone || "+1 415 555 0121"}
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
