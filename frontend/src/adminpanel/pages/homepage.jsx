import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  setBannerActive,
} from "@/store/slice/AdminSlice/bannerSlice";
import {
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
  setSectionVisible,
} from "@/store/slice/AdminSlice/sectionSlice";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/DataTable";
import { FormDialog } from "../components/FormDialog";
import { ImageUpload } from "../components/ImageUpload";
import { Field, PageHeader, Pill } from "../components/ui-kit";
import { errMessage } from "../lib/format";

// ---------------- banners ----------------
const BANNER_EMPTY = {
  type: "hero",
  title: "",
  subtitle: "",
  image: "",
  linkUrl: "",
  sortOrder: 0,
  isActive: true,
};

function BannerForm({ editing, onClose }) {
  const [form, setForm] = useState(
    editing
      ? {
          ...BANNER_EMPTY,
          ...editing,
          subtitle: editing.subtitle || "",
          linkUrl: editing.linkUrl || "",
        }
      : BANNER_EMPTY,
  );
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { creating, updating } = useSelector((state) => state.adminBanner);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.image) e.image = "Please upload a banner image";
    setErrors(e);
    if (Object.keys(e).length) return;
    const body = {
      type: form.type,
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      linkUrl: form.linkUrl,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };
    try {
      if (editing) await dispatch(updateBanner({ id: editing.id, ...body })).unwrap();
      else await dispatch(createBanner(body)).unwrap();
      toast.success(editing ? "Banner updated" : "Banner added");
      onClose();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <FormDialog
      open
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "Edit banner" : "Add banner"}
      onSubmit={submit}
      submitting={creating || updating}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <Select value={form.type} onValueChange={set("type")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hero">Hero banner</SelectItem>
              <SelectItem value="promo">Promotional banner</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Display order" hint="Lower numbers first.">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder")(e.target.value)}
          />
        </Field>
      </div>
      <Field label="Heading" required error={errors.title}>
        <Input
          value={form.title}
          onChange={(e) => set("title")(e.target.value)}
        />
      </Field>
      <Field label="Description">
        <Textarea
          rows={2}
          value={form.subtitle}
          onChange={(e) => set("subtitle")(e.target.value)}
        />
      </Field>
      <Field
        label="Link"
        hint="Where the banner button goes, e.g. /menu or /offers"
      >
        <Input
          value={form.linkUrl}
          onChange={(e) => set("linkUrl")(e.target.value)}
          placeholder="/menu"
        />
      </Field>
      <Field label="Image" required error={errors.image}>
        <ImageUpload
          value={form.image}
          onChange={set("image")}
          error={errors.image}
        />
      </Field>
      <div className="flex items-center justify-between rounded-xl border p-3">
        <p className="text-sm font-medium">Visible on website</p>
        <Switch checked={form.isActive} onCheckedChange={set("isActive")} />
      </div>
    </FormDialog>
  );
}

function BannersTab() {
  const dispatch = useDispatch();
  const { list: data, deleting, error } = useSelector((state) => state.adminBanner);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchBanners());

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const toggle = async (b, isActive) => {
    try {
      await dispatch(setBannerActive({ id: b.id, isActive })).unwrap();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };
  const confirmDelete = async () => {
    try {
      await dispatch(deleteBanner(toDelete.id)).unwrap();
      toast.success("Banner deleted");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setToDelete(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setForm("new")}>
          <FiPlus /> Add banner
        </Button>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load banners"
          action={
            <Button variant="outline" size="sm" onClick={refetch}>
              Retry
            </Button>
          }
        />
      ) : data.length === 0 ? (
        <EmptyState
          title="No banners yet"
          hint="Add a hero banner to feature at the top of the homepage."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((b) => (
            <Card key={b.id} className="overflow-hidden shadow-soft">
              <div className="relative aspect-[16/7] bg-muted">
                <img
                  src={b.image}
                  alt={b.title}
                  className="h-full w-full object-cover"
                />
                <Pill
                  tone={b.type === "hero" ? "primary" : "info"}
                  className="absolute left-2 top-2 bg-card/90"
                >
                  {b.type === "hero" ? "Hero" : "Promo"}
                </Pill>
              </div>
              <div className="space-y-1 p-4">
                <p className="truncate font-semibold">{b.title}</p>
                <p className="line-clamp-2 min-h-8 text-xs text-muted-foreground">
                  {b.subtitle}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Switch
                      checked={b.isActive}
                      onCheckedChange={(v) => toggle(b, v)}
                    />{" "}
                    {b.isActive ? "Visible" : "Hidden"} · #{b.sortOrder}
                  </label>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit"
                      onClick={() => setForm(b)}
                    >
                      <FiEdit2 />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      className="text-destructive"
                      onClick={() => setToDelete(b)}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {form && (
        <BannerForm
          editing={form === "new" ? null : form}
          onClose={() => setForm(null)}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Delete "${toDelete?.title}"?`}
        description="The banner will be removed from the website."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}

// ---------------- homepage sections ----------------
const SECTION_TYPES = [
  { value: "categories", label: "Categories" },
  { value: "offers", label: "Special offers" },
  { value: "bestsellers", label: "Bestsellers" },
  { value: "featured", label: "Featured foods" },
  { value: "popular", label: "Popular foods" },
  { value: "trending", label: "Trending foods (last 30 days)" },
];
const typeLabel = (t) => SECTION_TYPES.find((s) => s.value === t)?.label || t;
const SECTION_EMPTY = {
  type: "featured",
  title: "",
  description: "",
  itemLimit: 8,
  sortOrder: 0,
  isVisible: true,
};

function SectionForm({ editing, onClose }) {
  const [form, setForm] = useState(
    editing
      ? { ...SECTION_EMPTY, ...editing, description: editing.description || "" }
      : SECTION_EMPTY,
  );
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { creating, updating } = useSelector((state) => state.adminSection);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = {};
    if (!form.title.trim()) e.title = "Heading is required";
    const limit = Number(form.itemLimit);
    if (!(limit >= 1 && limit <= 24)) e.itemLimit = "Between 1 and 24";
    setErrors(e);
    if (Object.keys(e).length) return;
    const body = {
      type: form.type,
      title: form.title,
      description: form.description,
      itemLimit: limit,
      sortOrder: Number(form.sortOrder) || 0,
      isVisible: form.isVisible,
    };
    try {
      if (editing) await dispatch(updateSection({ id: editing.id, ...body })).unwrap();
      else await dispatch(createSection(body)).unwrap();
      toast.success(editing ? "Section updated" : "Section added");
      onClose();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <FormDialog
      open
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "Edit section" : "Add section"}
      onSubmit={submit}
      submitting={creating || updating}
    >
      <Field label="Content shown">
        <Select value={form.type} onValueChange={set("type")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="Heading" required error={errors.title}>
        <Input
          value={form.title}
          onChange={(e) => set("title")(e.target.value)}
        />
      </Field>
      <Field label="Description">
        <Textarea
          rows={2}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Items to show" error={errors.itemLimit}>
          <Input
            type="number"
            min="1"
            max="24"
            value={form.itemLimit}
            onChange={(e) => set("itemLimit")(e.target.value)}
          />
        </Field>
        <Field label="Display order" hint="Lower numbers first.">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder")(e.target.value)}
          />
        </Field>
      </div>
      <div className="flex items-center justify-between rounded-xl border p-3">
        <p className="text-sm font-medium">Visible on homepage</p>
        <Switch checked={form.isVisible} onCheckedChange={set("isVisible")} />
      </div>
    </FormDialog>
  );
}

function SectionsTab() {
  const dispatch = useDispatch();
  const { list: data, deleting, error } = useSelector((state) => state.adminSection);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchSections());

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const toggle = async (s, isVisible) => {
    try {
      await dispatch(setSectionVisible({ id: s.id, isVisible })).unwrap();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };
  const confirmDelete = async () => {
    try {
      await dispatch(deleteSection(toDelete.id)).unwrap();
      toast.success("Section deleted");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setToDelete(null);
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Sections appear on the customer homepage in this order.
        </p>
        <Button onClick={() => setForm("new")}>
          <FiPlus /> Add section
        </Button>
      </div>
      <Card className="divide-y overflow-hidden shadow-soft">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="m-4 h-12" />
          ))
        ) : isError ? (
          <EmptyState
            title="Could not load sections"
            action={
              <Button variant="outline" size="sm" onClick={refetch}>
                Retry
              </Button>
            }
          />
        ) : data.length === 0 ? (
          <EmptyState
            title="No sections"
            hint="Without sections, the homepage shows only the hero banner."
          />
        ) : (
          data.map((s) => (
            <div
              key={s.id}
              className="flex flex-wrap items-center gap-3 px-5 py-3.5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-primary">
                {s.sortOrder}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {typeLabel(s.type)} · up to {s.itemLimit} items
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch
                  checked={s.isVisible}
                  onCheckedChange={(v) => toggle(s, v)}
                />{" "}
                {s.isVisible ? "Visible" : "Hidden"}
              </label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                  onClick={() => setForm(s)}
                >
                  <FiEdit2 />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                  className="text-destructive"
                  onClick={() => setToDelete(s)}
                >
                  <FiTrash2 />
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
      {form && (
        <SectionForm
          editing={form === "new" ? null : form}
          onClose={() => setForm(null)}
        />
      )}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Delete "${toDelete?.title}"?`}
        description="This section will be removed from the homepage."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}

export default function HomepagePage() {
  return (
    <>
      <PageHeader
        title="Banners & homepage"
        description="Control what customers see on the HomeBites homepage."
      />
      <Tabs defaultValue="banners">
        <TabsList className="mb-4">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="sections">Homepage sections</TabsTrigger>
        </TabsList>
        <TabsContent value="banners">
          <BannersTab />
        </TabsContent>
        <TabsContent value="sections">
          <SectionsTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
