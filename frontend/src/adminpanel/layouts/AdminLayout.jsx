import { useEffect, useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiGrid,
  FiTag,
  FiCoffee,
  FiPercent,
  FiHeart,
  FiImage,
  FiShoppingBag,
  FiUsers,
  FiStar,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiExternalLink,
  FiMoon,
  FiSun,
  FiBell,
} from "react-icons/fi";
import { adminLogout, selectAdminUser } from "@/store/slice/AdminSlice/authSlice";
import { selectTheme, toggleTheme } from "@/store/slice/uiSlice";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fetchPendingOrders } from "@/store/slice/AdminSlice/orderSlice";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/foods", label: "Foods", icon: FiCoffee },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/offers", label: "Offers", icon: FiPercent },
  { to: "/admin/homepage", label: "Banners & Homepage", icon: FiImage },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/wishlist", label: "Wishlist", icon: FiHeart },
  { to: "/admin/reviews", label: "Reviews", icon: FiStar },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

function SidebarNav({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <img src={logo} alt="HomeBites" className="h-14 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <FiExternalLink className="h-4 w-4" /> View website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectAdminUser);
  const theme = useSelector(selectTheme);

  const pendingCount = useSelector((state) => state.adminOrder.pendingTotal);
  useEffect(() => {
    dispatch(fetchPendingOrders());
    const timer = setInterval(() => dispatch(fetchPendingOrders()), 30000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r lg:block">
        <SidebarNav />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <FiMenu />
          </Button>
          <div className="flex-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleTheme())}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/admin/orders?status=placed")}
            aria-label="Pending orders"
          >
            <FiBell />
            {pendingCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {pendingCount > 99 ? "99+" : pendingCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm font-medium hover:bg-accent">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {(user?.name || "A").charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-32 truncate sm:inline">
                  {user?.name || "Admin"}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate">{user?.name}</p>
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {user?.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/")}>
                <FiExternalLink className="mr-2 h-4 w-4" /> View website
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <FiLogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="mx-auto max-w-7xl p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
