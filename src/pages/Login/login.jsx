import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiStar,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import logo from "@/assets/logo.png";

export default function LoginPage() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSuccess = (userObj) => {
    dispatch({ type: "LOGIN", user: userObj });
    toast.success(`Welcome to Foodly, ${userObj.name.split(" ")[0]}! 🎉`);
    navigate(redirectPath);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const user = {
        id: "u_" + Date.now(),
        name: formData.name.trim() || (mode === "signup" ? "New Foodie" : "Alex Johnson"),
        email: formData.email.trim() || "alex.johnson@example.com",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        phone: "+1 415 555 0121",
      };
      handleLoginSuccess(user);
    }, 600);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoUser = {
        id: "demo_101",
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        phone: "+1 415 555 0121",
      };
      handleLoginSuccess(demoUser);
    }, 400);
  };

  return (
    <div className="relative min-h-[90vh] overflow-hidden py-10 px-4 flex items-center justify-center">

      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />

      <div className="mx-auto w-full max-w-5xl grid gap-8 lg:grid-cols-12 items-center">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-3xl gradient-hero p-8 text-primary-foreground shadow-elegant min-h-[580px] relative overflow-hidden"
        >
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="Foodly" className="h-16 w-auto filter brightness-0 invert" />
            </div>

            <div className="mt-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold backdrop-blur">
                <FiZap className="h-3.5 w-3.5" /> Fast & Fresh Delivery
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
                Taste the extraordinary, delivered daily.
              </h1>
              <p className="text-sm opacity-90 leading-relaxed">
                Unlock exclusive chef specials, real-time order tracking, and lightning-fast food
                delivery straight to your doorstep.
              </p>
            </div>
          </div>

          {/* Floating Badges */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/25 text-white">
                <FiStar className="h-5 w-5 fill-current" />
              </div>
              <div>
                <div className="text-sm font-bold">4.9 / 5.0 Rating</div>
                <div className="text-xs opacity-80">Over 50,000+ satisfied food lovers</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-3.5 backdrop-blur">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/25 text-white">
                <FiCheckCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-bold">Zero Hidden Fees</div>
                <div className="text-xs opacity-80">Transparent pricing & instant rewards</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 w-full rounded-3xl border border-border/60 glass p-6 md:p-10 shadow-elegant"
        >
          <div className="flex items-center justify-between lg:hidden mb-6">
            <img src={logo} alt="Foodly" className="h-10 w-auto" />
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Foodly App
            </span>
          </div>

          <div className="flex rounded-2xl bg-accent/60 p-1.5 ring-1 ring-border/40">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${mode === "signin"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${mode === "signup"
                ? "bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              {mode === "signin" ? "Welcome back to Foodly" : "Join Foodly today"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === "signin"
                ? "Enter your account credentials to access your order history & rewards."
                : "Sign up in seconds to start ordering from top nearby kitchens."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-1 overflow-hidden"
                >
                  <label className="text-xs font-semibold text-foreground">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Johnson"
                      className="w-full rounded-2xl border border-border/80 bg-background/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Email Address or Phone
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex.johnson@example.com"
                  className="w-full rounded-2xl border border-border/80 bg-background/60 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Password</label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => toast("Password reset link sent to email! 🔑")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl border border-border/80 bg-background/60 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full gradient-warm text-base font-bold text-primary-foreground shadow-soft hover:shadow-glow transition-all mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === "signin" ? "Sign In to Foodly" : "Create My Account"}
                  <FiArrowRight className="h-5 w-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60" />
            </div>
            <span className="relative bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Social Sign-In Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-4 text-sm font-semibold hover:bg-accent transition-all"
            >
              <FaGoogle className="h-4 w-4 text-red-500" /> Google
            </button>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-4 text-sm font-semibold hover:bg-accent transition-all"
            >
              <FaApple className="h-4 w-4" /> Apple
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
