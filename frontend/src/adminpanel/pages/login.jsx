import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiLock, FiMail, FiShield } from "react-icons/fi";
import { loginAdmin } from "@/store/slice/AdminSlice/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "../components/ui-kit";
import { errMessage } from "../lib/format";
import logo from "@/assets/logo.png";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, checked, loggingIn: isLoading } = useSelector((state) => state.adminAuth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // Already signed in as an admin (verified)? Go straight to the dashboard.
  if (checked && user?.role === "admin") return <Navigate to="/admin" replace />;

  const validate = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(
        loginAdmin({
          email: form.email.trim(),
          password: form.password,
        }),
      ).unwrap();
      toast.success("Welcome back!");
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(errMessage(err, "Login failed"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-elegant">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src={logo} alt="HomeBites" className="mb-3 h-12 w-auto" />
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <FiShield />
          </div>
          <h1 className="text-xl font-extrabold">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">
            Manage foods, orders, offers and more.
          </p>
        </div>

        {(location.state?.denied || (checked && user && user.role !== "admin")) && (
          <p className="mb-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
            This account does not have admin access. Sign in with an admin
            account.
          </p>
        )}

        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Email" error={errors.email}>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                autoComplete="username"
                className="pl-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@homebites.app"
              />
            </div>
          </Field>
          <Field label="Password" error={errors.password}>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                autoComplete="current-password"
                className="pl-9"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
