import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminMe, selectIsAdminAuthenticated } from "@/store/slice/AdminSlice/authSlice";

// UI gate only. The real enforcement is on the backend: every /api/admin route
// re-checks the role stored in the database. This just decides what to render.
export default function AdminGuard() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAdminAuthenticated);
  const { user, checked, error } = useSelector((state) => state.adminAuth);
  const location = useLocation();

  // Re-verify the role against the database once per browser session.
  useEffect(() => {
    if (isAuthenticated && !checked) dispatch(fetchAdminMe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    );
  }
  if (!checked && !error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }
  // 401/403 -> not an admin (or session expired)
  if (error || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace state={{ denied: true }} />;
  }
  return <Outlet />;
}
