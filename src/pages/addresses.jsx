import { useApp } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FiPlus, FiHome, FiBriefcase } from "react-icons/fi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressesPage() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { label: "Home", line1: "", city: "", phone: "" } });

  const onSubmit = (v) => {
    dispatch({ type: "ADD_ADDRESS", address: { id: `a${Date.now()}`, ...v } });
    toast.success("Address added");
    reset();
    setOpen(false);
  };

  const icon = (l) => (l === "Home" ? <FiHome /> : l === "Work" ? <FiBriefcase /> : "🏨");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Saved addresses</h1>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full gradient-warm px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft"
        >
          <FiPlus /> Add address
        </button>
      </div>
      <div className="mt-6 space-y-3">
        {state.addresses.map((a) => (
          <motion.div
            key={a.id}
            layout
            className="flex items-start gap-4 rounded-2xl bg-card p-5 shadow-soft ring-1 ring-border/40"
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-primary">
              {icon(a.label)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 font-bold">
                {a.label}{" "}
                {a.isDefault && (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
                    DEFAULT
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {a.line1}, {a.city}
              </div>
              <div className="text-sm text-muted-foreground">{a.phone}</div>
              <div className="mt-2 flex gap-4 text-sm">
                {!a.isDefault && (
                  <button
                    onClick={() => dispatch({ type: "SET_DEFAULT_ADDRESS", id: a.id })}
                    className="font-semibold text-primary"
                  >
                    Set default
                  </button>
                )}
                <button
                  onClick={() => {
                    dispatch({ type: "REMOVE_ADDRESS", id: a.id });
                    toast("Address removed");
                  }}
                  className="font-semibold text-destructive"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={() => setOpen(false)}
          >
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md space-y-4 rounded-3xl bg-card p-6 shadow-elegant"
            >
              <h2 className="text-xl font-extrabold">Add new address</h2>
              <div>
                <label className="text-xs font-semibold">Label</label>
                <select
                  {...register("label")}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option>Home</option>
                  <option>Work</option>
                  <option>Hotel</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold">Street address</label>
                <input
                  {...register("line1", { required: true })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  placeholder="123 Main St, Apt 5"
                />
                {errors.line1 && <div className="mt-1 text-xs text-destructive">Required</div>}
              </div>
              <div>
                <label className="text-xs font-semibold">City</label>
                <input
                  {...register("city", { required: true })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">Phone</label>
                <input
                  {...register("phone", { required: true })}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button className="rounded-full gradient-warm px-5 py-2 text-sm font-bold text-primary-foreground">
                  Save
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
