import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppRoutes from "@/CustomerWebsite/routes/AppRoutes";
import ProtectedLayout from "@/CustomerWebsite/routes/ProtectedLayout";
import AppShell from "@/CustomerWebsite/layouts/AppShell";
import LoginPage from "@/CustomerWebsite/pages/Login/login";
import { Toaster } from "react-hot-toast";
import { selectTheme } from "@/store/slice/uiSlice";

// Admin panel lives in /adminpanel and is loaded only when someone visits /admin.
const AdminRoutes = lazy(() => import("@/adminpanel/routes/AdminRoutes"));

export default function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <AdminRoutes />
              </Suspense>
            }
          />

          <Route element={<ProtectedLayout />}>
            <Route element={<AppShell />}>
              <Route path="/*" element={<AppRoutes />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: 500,
          },
        }}
      />
    </>
  );
}
