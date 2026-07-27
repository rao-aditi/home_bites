import { Link, useLocation, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiLogIn, FiArrowLeft, FiUserCheck, FiShield } from "react-icons/fi";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LoginPage from "@/pages/Login/login";

export default function ProtectedLayout({ children }) {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const pathname = location.pathname;

  if (!state.isAuthenticated) {
    return (
      <>
        <LoginPage />
      </>
    );
  }

  return children || <Outlet />;
}
