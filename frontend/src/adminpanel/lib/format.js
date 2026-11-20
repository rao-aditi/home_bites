export const money = (n) => `$${Number(n || 0).toFixed(2)}`;

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

// <input type="datetime-local"> <-> ISO string
export const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const fromLocalInput = (v) => (v ? new Date(v).toISOString() : null);

// Order statuses are stored using the customer app's vocabulary; the admin sees friendly labels.
export const ORDER_STATUSES = [
  { value: "placed", label: "Pending", tone: "warning" },
  { value: "accepted", label: "Confirmed", tone: "info" },
  { value: "preparing", label: "Preparing", tone: "info" },
  { value: "ready", label: "Ready", tone: "info" },
  { value: "assigned", label: "Rider assigned", tone: "info" },
  { value: "out", label: "Out for Delivery", tone: "primary" },
  { value: "delivered", label: "Delivered", tone: "success" },
  { value: "cancelled", label: "Cancelled", tone: "danger" },
];

export const statusMeta = (value) =>
  ORDER_STATUSES.find((s) => s.value === value) || {
    value,
    label: value,
    tone: "muted",
  };

// Thunks reject with the server's message as a plain string (see store/makeApiThunk).
export const errMessage = (err, fallback = "Something went wrong") =>
  (typeof err === "string" && err) || err?.message || fallback;
