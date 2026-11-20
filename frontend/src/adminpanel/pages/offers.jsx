import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiEdit2, FiPercent, FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  setOfferActive,
} from "@/store/slice/AdminSlice/offerSlice";
import { useListState } from "../hooks/useListState";
import { DataTable, EmptyState } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FormDialog } from "../components/FormDialog";
import { ImageUpload } from "../components/ImageUpload";
import {
  Field,
  FilterSelect,
  PageHeader,
  Pill,
  SearchBox,
  Toolbar,
} from "../components/ui-kit";
import {
  errMessage,
  fmtDate,
  fromLocalInput,
  money,
  toLocalInput,
} from "../lib/format";

const COLORS = [
  { value: "from-orange-500 to-pink-500", label: "Sunset" },
  { value: "from-emerald-500 to-teal-500", label: "Fresh green" },
  { value: "from-purple-500 to-indigo-500", label: "Purple" },
  { value: "from-rose-500 to-red-500", label: "Red" },
  { value: "from-amber-400 to-orange-500", label: "Amber" },
];

const EMPTY = {
  code: "",
  title: "",
  subtitle: "",
  description: "",
  bannerImage: "",
  color: COLORS[0].value,
  discountType: "percent",
  value: "",
  minOrderAmount: 0,
  maxDiscount: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

const describe = (o) =>
  o.discountType === "percent"
    ? `${o.value}% off`
    : o.discountType === "flat"
      ? `${money(o.value)} off`
      : "Free delivery";

function statusOf(o) {
  const now = Date.now();
  if (!o.isActive) return { label: "Disabled", tone: "muted" };
  if (o.expiresAt && new Date(o.expiresAt) < now)
    return { label: "Expired", tone: "danger" };
  if (o.startsAt && new Date(o.startsAt) > now)
    return { label: "Scheduled", tone: "info" };
  return { label: "Live", tone: "success" };
}

function OfferForm({ editing, onClose }) {
  const [form, setForm] = useState(
    editing
      ? {
          ...EMPTY,
          ...editing,
          description: editing.description || "",
          bannerImage: editing.bannerImage || "",
          maxDiscount: editing.maxDiscount ?? "",
          startsAt: toLocalInput(editing.startsAt),
          expiresAt: toLocalInput(editing.expiresAt),
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { creating, updating } = useSelector((state) => state.adminOffer);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = {};
    const value = Number(form.value);
    if (form.code.trim().length < 3) e.code = "At least 3 characters";
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.subtitle.trim()) e.subtitle = "Short subtitle is required";
    if (form.discountType !== "free_delivery" && !(value > 0))
      e.value = "Enter a value greater than 0";
    if (form.discountType === "percent" && value > 100)
      e.value = "Cannot exceed 100%";
    if (
      form.startsAt &&
      form.expiresAt &&
      new Date(form.expiresAt) <= new Date(form.startsAt)
    ) {
      e.expiresAt = "Must be after the start date";
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    const body = {
      code: form.code,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      bannerImage: form.bannerImage,
      color: form.color,
      discountType: form.discountType,
      value: form.discountType === "free_delivery" ? 0 : value,
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),
      startsAt: fromLocalInput(form.startsAt),
      expiresAt: fromLocalInput(form.expiresAt),
      isActive: form.isActive,
    };
    try {
      if (editing) await dispatch(updateOffer({ id: editing.id, ...body })).unwrap();
      else await dispatch(createOffer(body)).unwrap();
      toast.success(editing ? "Offer updated" : "Offer created");
      onClose();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <FormDialog
      open
      wide
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "Edit offer" : "Create offer"}
      description="Live offers show on the website and can be applied as coupons at checkout."
      onSubmit={submit}
      submitting={creating || updating}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Coupon code" required error={errors.code}>
          <Input
            value={form.code}
            onChange={(e) => set("code")(e.target.value.toUpperCase())}
            placeholder="WELCOME50"
          />
        </Field>
        <Field label="Title" required error={errors.title}>
          <Input
            value={form.title}
            onChange={(e) => set("title")(e.target.value)}
          />
        </Field>
      </div>
      <Field
        label="Subtitle"
        required
        error={errors.subtitle}
        hint="One short line shown on the offer card."
      >
        <Input
          value={form.subtitle}
          onChange={(e) => set("subtitle")(e.target.value)}
        />
      </Field>
      <Field label="Description">
        <Textarea
          rows={2}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Discount type">
          <Select value={form.discountType} onValueChange={set("discountType")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent">Percentage</SelectItem>
              <SelectItem value="flat">Fixed amount</SelectItem>
              <SelectItem value="free_delivery">Free delivery</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        {form.discountType !== "free_delivery" && (
          <Field
            label={
              form.discountType === "percent" ? "Percentage" : "Amount ($)"
            }
            required
            error={errors.value}
          >
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.value}
              onChange={(e) => set("value")(e.target.value)}
            />
          </Field>
        )}
        <Field label="Card colour">
          <Select value={form.color} onValueChange={set("color")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Minimum order ($)">
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.minOrderAmount}
            onChange={(e) => set("minOrderAmount")(e.target.value)}
          />
        </Field>
        <Field
          label="Maximum discount ($)"
          hint="Optional cap for percentage offers."
        >
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.maxDiscount}
            onChange={(e) => set("maxDiscount")(e.target.value)}
          />
        </Field>
        <Field label="Starts at" hint="Leave empty to start immediately.">
          <Input
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => set("startsAt")(e.target.value)}
          />
        </Field>
        <Field
          label="Expires at"
          error={errors.expiresAt}
          hint="Leave empty for no expiry."
        >
          <Input
            type="datetime-local"
            value={form.expiresAt}
            onChange={(e) => set("expiresAt")(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Banner image">
        <ImageUpload value={form.bannerImage} onChange={set("bannerImage")} />
      </Field>
      <div className="flex items-center justify-between rounded-xl border p-3">
        <p className="text-sm font-medium">Enabled</p>
        <Switch checked={form.isActive} onCheckedChange={set("isActive")} />
      </div>
    </FormDialog>
  );
}

export default function OffersPage() {
  const list = useListState({ isActive: "all" });
  const dispatch = useDispatch();
  const { list: data, loading: isFetching, deleting, error } = useSelector(
    (state) => state.adminOffer,
  );
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchOffers(list.params));

  useEffect(() => {
    dispatch(fetchOffers(list.params));
  }, [dispatch, list.params]);
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const toggle = async (o, isActive) => {
    try {
      await dispatch(setOfferActive({ id: o.id, isActive })).unwrap();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteOffer(toDelete.id)).unwrap();
      toast.success("Offer deleted");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setToDelete(null);
  };

  const columns = [
    {
      key: "title",
      header: "Offer",
      sortKey: "title",
      cell: (o) => (
        <div>
          <p className="font-semibold">{o.title}</p>
          <p className="text-xs text-muted-foreground">{o.subtitle}</p>
        </div>
      ),
    },
    {
      key: "code",
      header: "Code",
      sortKey: "code",
      cell: (o) => (
        <Pill tone="primary" className="font-mono">
          {o.code}
        </Pill>
      ),
    },
    { key: "discount", header: "Discount", cell: (o) => describe(o) },
    {
      key: "rules",
      header: "Rules",
      cell: (o) => (
        <span className="text-xs text-muted-foreground">
          {o.minOrderAmount > 0
            ? `Min ${money(o.minOrderAmount)}`
            : "No minimum"}
          {o.maxDiscount != null && ` · Max ${money(o.maxDiscount)}`}
        </span>
      ),
    },
    {
      key: "validity",
      header: "Validity",
      sortKey: "expiresAt",
      cell: (o) => (
        <span className="text-xs text-muted-foreground">
          {o.startsAt ? fmtDate(o.startsAt) : "Now"} →{" "}
          {o.expiresAt ? fmtDate(o.expiresAt) : "No expiry"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => {
        const s = statusOf(o);
        return <Pill tone={s.tone}>{s.label}</Pill>;
      },
    },
    {
      key: "isActive",
      header: "Enabled",
      cell: (o) => (
        <Switch checked={o.isActive} onCheckedChange={(v) => toggle(o, v)} />
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (o) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit"
            onClick={() => setForm(o)}
          >
            <FiEdit2 />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            className="text-destructive"
            onClick={() => setToDelete(o)}
          >
            <FiTrash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Offers & coupons"
        description="Create discounts customers can see and apply at checkout."
        actions={
          <Button onClick={() => setForm("new")}>
            <FiPlus /> Create offer
          </Button>
        }
      />
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Search by title or code…"
        />
        <FilterSelect
          value={list.filters.isActive}
          onChange={(v) => list.setFilter("isActive", v)}
          allLabel="All statuses"
          options={[
            { value: "true", label: "Enabled" },
            { value: "false", label: "Disabled" },
          ]}
        />
      </Toolbar>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={refetch}
        onPage={list.setPage}
        sort={list.sort}
        onSort={list.setSort}
        empty={
          <EmptyState
            icon={FiPercent}
            title="No offers yet"
            hint="Create an offer to show it on the website."
            action={
              <Button size="sm" onClick={() => setForm("new")}>
                <FiPlus /> Create offer
              </Button>
            }
          />
        }
      />
      {form && (
        <OfferForm
          editing={form === "new" ? null : form}
          onClose={() => setForm(null)}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Delete "${toDelete?.title}"?`}
        description="Customers will no longer be able to use this coupon."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
