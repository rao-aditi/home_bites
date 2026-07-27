import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiBell,
  FiUser,
  FiMenu,
  FiX,
  FiMapPin,
  FiMic,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useApp, cartCount } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/offers", label: "Offers" },
  { to: "/categories", label: "Categories" },
  { to: "/restaurants", label: "Restaurants" },
];

export function Navbar() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const count = cartCount(state.cart);

  const onSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const user = state.user;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-7 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="Foodly" className="w-52 h-16 object-contain" />
        </Link>

        <button
          onClick={() => dispatch({ type: "SET_LOCATION", location: state.location })}
          className="hidden shrink-0 items-center gap-1.5 rounded-full bg-accent/50 px-3 py-1.5 text-sm font-medium hover:bg-accent md:flex"
        >
          <FiMapPin className="text-primary" />
          <span className="max-w-[140px] truncate">{state.location}</span>
        </button>

        <form onSubmit={onSearch} className="relative hidden flex-1 md:block">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for restaurants, dishes, cuisines..."
            className="w-full rounded-full border border-border bg-background/60 py-2.5 pl-10 pr-12 text-sm outline-none transition focus:border-primary focus:shadow-soft"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-primary"
            title="Voice search"
          >
            <FiMic />
          </button>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground [&.active]:text-primary [&.active]:font-bold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => dispatch({ type: "TOGGLE_THEME" })}
            className="rounded-full p-2 hover:bg-accent"
            aria-label="Toggle theme"
          >
            {state.theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          <Link to="/wishlist" className="rounded-full p-2 hover:bg-accent" aria-label="Wishlist">
            <FiHeart />
          </Link>
          <Link
            to="/notifications"
            className="relative rounded-full p-2 hover:bg-accent"
            aria-label="Notifications"
          >
            <FiBell />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-accent" aria-label="Cart">
            <FiShoppingBag />
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
              >
                {count}
              </motion.span>
            )}
          </Link>

          {state.isAuthenticated ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 rounded-full bg-accent/60 pl-1.5 pr-3 py-1 hover:bg-accent transition"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <span className="text-xs font-bold truncate max-w-[90px] hidden sm:inline">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button
                size="sm"
                className="rounded-full gradient-warm border-0 text-primary-foreground shadow-soft hover:opacity-90 font-bold px-4"
              >
                Sign in
              </Button>
            </Link>
          )}

          <button
            className="rounded-full p-2 hover:bg-accent lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/50 lg:hidden"
          >
            <div className="space-y-3 p-4">
              <form onSubmit={onSearch} className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </form>
              <div className="flex items-center gap-1.5 rounded-full bg-accent/50 px-3 py-2 text-sm">
                <FiMapPin className="text-primary" /> {state.location}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-accent/40 px-4 py-3 text-sm font-medium hover:bg-accent"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/orders"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-accent/40 px-4 py-3 text-sm font-medium hover:bg-accent"
                >
                  My Orders
                </Link>
                {state.isAuthenticated ? (
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-primary/10 text-primary font-bold px-4 py-3 text-sm hover:bg-primary/20"
                  >
                    My Profile
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl gradient-warm text-primary-foreground font-bold px-4 py-3 text-sm hover:opacity-90"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
