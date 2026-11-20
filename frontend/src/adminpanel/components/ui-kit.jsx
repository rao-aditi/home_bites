// Small reusable building blocks shared by every admin page.
import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

export function Toolbar({ children }) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {children}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search…" }) {
  return (
    <div className="relative w-full sm:w-72">
      <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}

// options: [{ value, label }]; the "all" option is added automatically.
export function FilterSelect({
  value,
  onChange,
  options,
  allLabel = "All",
  className,
}) {
  return (
    <Select value={value || "all"} onValueChange={onChange}>
      <SelectTrigger className={cn("w-full sm:w-44", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Field({ label, error, hint, required, children, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export function SwitchField({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch checked={!!checked} onCheckedChange={onChange} />
    </div>
  );
}

const TONES = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-[oklch(0.5_0.12_70)] dark:text-warning",
  danger: "bg-destructive/15 text-destructive",
  info: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  primary: "bg-primary/15 text-primary",
  muted: "bg-muted text-muted-foreground",
};

export function Pill({ tone = "muted", children, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  loading,
}) {
  return (
    <Card className="flex items-center gap-4 p-5 shadow-soft">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          TONES[tone],
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-extrabold tracking-tight">
          {loading ? "…" : value}
        </p>
      </div>
    </Card>
  );
}

export function Thumb({ src, alt = "", className }) {
  return src ? (
    <img
      src={src}
      alt={alt}
      className={cn("h-10 w-10 rounded-lg border object-cover", className)}
      loading="lazy"
    />
  ) : (
    <div className={cn("h-10 w-10 rounded-lg border bg-muted", className)} />
  );
}
