import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import { AppProvider } from "@/context/AppContext";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
import AppShell from "@/layouts/AppShell";
import LoginPage from "@/pages/Login/login";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

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
    </AppProvider>
  );
}
