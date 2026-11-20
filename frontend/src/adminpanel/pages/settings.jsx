import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSettings, updateSettings } from "@/store/slice/AdminSlice/settingsSlice";
import { ImageUpload } from "../components/ImageUpload";
import { EmptyState } from "../components/DataTable";
import { Field, PageHeader, SwitchField } from "../components/ui-kit";
import { errMessage } from "../lib/format";

function Section({ title, description, children }) {
  return (
    <Card className="p-5 shadow-soft">
      <h2 className="font-bold">{title}</h2>
      {description && (
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      )}
      <div className={description ? "space-y-4" : "mt-4 space-y-4"}>
        {children}
      </div>
    </Card>
  );
}

const toForm = (s) => ({
  ...s,
  email: s.email || "",
  facebookUrl: s.facebookUrl || "",
  instagramUrl: s.instagramUrl || "",
  twitterUrl: s.twitterUrl || "",
  youtubeUrl: s.youtubeUrl || "",
});

export default function SettingsPage() {
  const dispatch = useDispatch();
  const { settings: data, saving, error } = useSelector((state) => state.adminSettings);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchSettings());

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) setForm(toForm(data));
  }, [data]);

  if (isError)
    return (
      <EmptyState
        title="Could not load settings"
        action={
          <Button variant="outline" size="sm" onClick={refetch}>
            Retry
          </Button>
        }
      />
    );
  if (isLoading || !form) return <Skeleton className="h-96 w-full" />;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const text = (k) => ({
    value: form[k] ?? "",
    onChange: (e) => set(k)(e.target.value),
  });

  const submit = async (ev) => {
    ev.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = "Website name is required";
    if (!form.logo) e.logo = "Logo is required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Address is required";
    for (const k of [
      "deliveryFee",
      "minOrderValue",
      "taxPercent",
      "serviceChargePercent",
    ]) {
      if (!(Number(form[k]) >= 0)) e[k] = "Must be 0 or more";
    }
    setErrors(e);
    if (Object.keys(e).length)
      return toast.error("Please fix the highlighted fields.");

    const { id, ...rest } = form;
    try {
      await dispatch(updateSettings({
        ...rest,
        deliveryFee: Number(rest.deliveryFee),
        minOrderValue: Number(rest.minOrderValue),
        taxPercent: Number(rest.taxPercent),
        serviceChargePercent: Number(rest.serviceChargePercent),
        avgDeliveryTime: Number(rest.avgDeliveryTime) || 30,
      })).unwrap();
      toast.success("Settings saved");
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <PageHeader
        title="Settings"
        description="Website details and ordering rules."
        actions={
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        }
      />
      <div className="space-y-6">
        <Section title="Website">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Website name" required error={errors.name}>
              <Input {...text("name")} />
            </Field>
            <Field label="Tagline">
              <Input {...text("tagline")} />
            </Field>
          </div>
          <Field label="About / description">
            <Textarea rows={3} {...text("description")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Logo" required error={errors.logo}>
              <ImageUpload
                value={form.logo}
                onChange={set("logo")}
                error={errors.logo}
              />
            </Field>
            <Field label="Cover banner">
              <ImageUpload value={form.banner} onChange={set("banner")} />
            </Field>
          </div>
        </Section>

        <Section title="Contact information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" required error={errors.phone}>
              <Input {...text("phone")} />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input type="email" {...text("email")} />
            </Field>
          </div>
          <Field label="Address" required error={errors.address}>
            <Input {...text("address")} />
          </Field>
          <Field label="Opening hours">
            <Input
              {...text("openingHours")}
              placeholder="9:00 AM - 11:00 PM, daily"
            />
          </Field>
        </Section>

        <Section
          title="Ordering & charges"
          description="Delivery fee and minimum order apply to every new order immediately."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Delivery charge ($)" error={errors.deliveryFee}>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...text("deliveryFee")}
              />
            </Field>
            <Field label="Minimum order ($)" error={errors.minOrderValue}>
              <Input
                type="number"
                min="0"
                step="0.01"
                {...text("minOrderValue")}
              />
            </Field>
            <Field label="Avg. delivery time (min)">
              <Input type="number" min="1" {...text("avgDeliveryTime")} />
            </Field>
            <Field
              label="Tax (%)"
              error={errors.taxPercent}
              hint="Saved for reference; see note below."
            >
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                {...text("taxPercent")}
              />
            </Field>
            <Field
              label="Service charge (%)"
              error={errors.serviceChargePercent}
              hint="Saved for reference; see note below."
            >
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                {...text("serviceChargePercent")}
              />
            </Field>
          </div>
          <p className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            Note: order totals currently use the app&apos;s built-in 5% GST and
            platform/packaging fees. The tax and service-charge values above are
            stored but do not yet change order totals.
          </p>
        </Section>

        <Section title="Social media">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook">
              <Input
                {...text("facebookUrl")}
                placeholder="https://facebook.com/…"
              />
            </Field>
            <Field label="Instagram">
              <Input
                {...text("instagramUrl")}
                placeholder="https://instagram.com/…"
              />
            </Field>
            <Field label="Twitter / X">
              <Input {...text("twitterUrl")} placeholder="https://x.com/…" />
            </Field>
            <Field label="YouTube">
              <Input
                {...text("youtubeUrl")}
                placeholder="https://youtube.com/…"
              />
            </Field>
          </div>
        </Section>

        <Section title="Availability">
          <SwitchField
            label="Kitchen open"
            hint="Shown on the website as open/closed."
            checked={form.isOpen}
            onChange={set("isOpen")}
          />
          <SwitchField
            label="Maintenance mode"
            hint="When on, customers can browse but cannot place orders."
            checked={form.maintenanceMode}
            onChange={set("maintenanceMode")}
          />
        </Section>
      </div>
    </form>
  );
}
