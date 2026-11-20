import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FiCoffee,
  FiEdit2,
  FiPlus,
  FiStar,
  FiTrash2,
  FiTrendingUp,
} from "react-icons/fi";
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
import { fetchCategoryOptions } from "@/store/slice/AdminSlice/categorySlice";
import {
  fetchFoods,
  createFood,
  updateFood,
  deleteFood,
  setFoodFlags,
} from "@/store/slice/AdminSlice/foodSlice";
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
  SwitchField,
  Thumb,
  Toolbar,
} from "../components/ui-kit";
import { errMessage, money } from "../lib/format";

const EMPTY = {
  name: "",
  description: "",
  categoryId: "",
  price: "",
  originalPrice: "",
  images: [],
  ingredientsText: "",
  isVeg: true,
  isAvailable: true,
  isFeatured: false,
  isPopular: false,
  isBestseller: false,
  isActive: true,
};

const useCategoryOptions = () => {
  const dispatch = useDispatch();
  const options = useSelector((state) => state.adminCategory.options);

  useEffect(() => {
    dispatch(fetchCategoryOptions({ limit: 100, sortBy: "name", sortDir: "asc" }));
  }, [dispatch]);

  return useMemo(() => options.map((c) => ({ value: c.id, label: c.name })), [options]);
};

function FoodForm({ editing, onClose }) {
  const categories = useCategoryOptions();
  const [form, setForm] = useState(
    editing
      ? {
          ...EMPTY,
          ...editing,
          originalPrice: editing.originalPrice ?? "",
          images: editing.images?.length
            ? editing.images
            : editing.image
              ? [editing.image]
              : [],
          ingredientsText: (editing.ingredients || []).join(", "),
        }
      : EMPTY,
  );
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { creating, updating } = useSelector((state) => state.adminFood);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = {};
    const price = Number(form.price);
    const original =
      form.originalPrice === "" ? null : Number(form.originalPrice);
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.categoryId) e.categoryId = "Select a category";
    if (!(price > 0)) e.price = "Enter a price greater than 0";
    if (original != null && !(original > price))
      e.originalPrice = "Must be higher than the selling price";
    if (form.images.length === 0) e.images = "Upload at least one image";
    setErrors(e);
    if (Object.keys(e).length) return;

    const body = {
      name: form.name,
      description: form.description,
      categoryId: form.categoryId,
      price,
      originalPrice: original,
      images: form.images,
      ingredients: form.ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isVeg: form.isVeg,
      isAvailable: form.isAvailable,
      isFeatured: form.isFeatured,
      isPopular: form.isPopular,
      isBestseller: form.isBestseller,
      isActive: form.isActive,
    };
    try {
      if (editing) await dispatch(updateFood({ id: editing.id, ...body })).unwrap();
      else await dispatch(createFood(body)).unwrap();
      toast.success(editing ? "Food updated" : "Food added");
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
      title={editing ? "Edit food" : "Add food"}
      onSubmit={submit}
      submitting={creating || updating}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <Input
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
          />
        </Field>
        <Field label="Category" required error={errors.categoryId}>
          <Select value={form.categoryId} onValueChange={set("categoryId")}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field label="Description" required error={errors.description}>
        <Textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description")(e.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Price ($)"
          required
          error={errors.price}
          hint="What the customer pays."
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => set("price")(e.target.value)}
          />
        </Field>
        <Field
          label="Original price ($)"
          error={errors.originalPrice}
          hint="Optional. Shown struck through as the discount."
        >
          <Input
            type="number"
            step="0.01"
            min="0"
            value={form.originalPrice}
            onChange={(e) => set("originalPrice")(e.target.value)}
          />
        </Field>
      </div>
      <Field
        label="Images"
        required
        error={errors.images}
        hint="The first image is the cover shown on the website."
      >
        <ImageUpload
          multiple
          value={form.images}
          onChange={set("images")}
          error={errors.images}
        />
      </Field>
      <Field
        label="Ingredients"
        hint="Comma separated, e.g. Tomato, Mozzarella, Basil"
      >
        <Input
          value={form.ingredientsText}
          onChange={(e) => set("ingredientsText")(e.target.value)}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <SwitchField
          label="Vegetarian"
          hint="Off = Non-Veg"
          checked={form.isVeg}
          onChange={set("isVeg")}
        />
        <SwitchField
          label="Available"
          hint="Off = shown as sold out"
          checked={form.isAvailable}
          onChange={set("isAvailable")}
        />
        <SwitchField
          label="Featured"
          checked={form.isFeatured}
          onChange={set("isFeatured")}
        />
        <SwitchField
          label="Popular"
          checked={form.isPopular}
          onChange={set("isPopular")}
        />
        <SwitchField
          label="Bestseller"
          checked={form.isBestseller}
          onChange={set("isBestseller")}
        />
        <SwitchField
          label="Enabled"
          hint="Off = hidden from customers"
          checked={form.isActive}
          onChange={set("isActive")}
        />
      </div>
    </FormDialog>
  );
}

export default function FoodsPage() {
  const categories = useCategoryOptions();
  const list = useListState({
    categoryId: "all",
    isActive: "all",
    isVeg: "all",
  });
  const dispatch = useDispatch();
  const { list: data, loading: isFetching, deleting, error } = useSelector(
    (state) => state.adminFood,
  );
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchFoods(list.params));

  useEffect(() => {
    dispatch(fetchFoods(list.params));
  }, [dispatch, list.params]);
  const [form, setForm] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const flag = async (f, patch) => {
    try {
      await dispatch(setFoodFlags({ id: f.id, ...patch })).unwrap();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteFood(toDelete.id)).unwrap();
      toast.success("Food deleted");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setToDelete(null);
  };

  const columns = [
    {
      key: "image",
      header: "",
      cell: (f) => <Thumb src={f.image} alt={f.name} />,
    },
    {
      key: "name",
      header: "Food",
      sortKey: "name",
      cell: (f) => (
        <div>
          <p className="font-semibold">{f.name}</p>
          <p className="text-xs text-muted-foreground">{f.category?.name}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortKey: "price",
      cell: (f) => (
        <div>
          <span className="font-semibold">{money(f.price)}</span>
          {f.originalPrice && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">
              {money(f.originalPrice)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "isVeg",
      header: "Type",
      cell: (f) => (
        <Pill tone={f.isVeg ? "success" : "danger"}>
          {f.isVeg ? "Veg" : "Non-Veg"}
        </Pill>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      cell: (f) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            title="Featured"
            className={
              f.isFeatured ? "text-primary" : "text-muted-foreground/50"
            }
            onClick={() => flag(f, { isFeatured: !f.isFeatured })}
          >
            <FiStar className={f.isFeatured ? "fill-current" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Popular"
            className={
              f.isPopular ? "text-primary" : "text-muted-foreground/50"
            }
            onClick={() => flag(f, { isPopular: !f.isPopular })}
          >
            <FiTrendingUp />
          </Button>
        </div>
      ),
    },
    {
      key: "isAvailable",
      header: "Available",
      cell: (f) => (
        <Switch
          checked={f.isAvailable}
          onCheckedChange={(v) => flag(f, { isAvailable: v })}
        />
      ),
    },
    {
      key: "isActive",
      header: "Enabled",
      cell: (f) => (
        <Switch
          checked={f.isActive}
          onCheckedChange={(v) => flag(f, { isActive: v })}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (f) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit"
            onClick={() => setForm(f)}
          >
            <FiEdit2 />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            className="text-destructive"
            onClick={() => setToDelete(f)}
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
        title="Foods"
        description="Everything customers can order. Changes appear on the website instantly."
        actions={
          <Button onClick={() => setForm("new")}>
            <FiPlus /> Add food
          </Button>
        }
      />
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Search foods…"
        />
        <FilterSelect
          value={list.filters.categoryId}
          onChange={(v) => list.setFilter("categoryId", v)}
          options={categories}
          allLabel="All categories"
        />
        <FilterSelect
          value={list.filters.isVeg}
          onChange={(v) => list.setFilter("isVeg", v)}
          allLabel="Veg & Non-Veg"
          options={[
            { value: "true", label: "Veg" },
            { value: "false", label: "Non-Veg" },
          ]}
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
            icon={FiCoffee}
            title="No foods found"
            hint="Add a food item or adjust your filters."
            action={
              <Button size="sm" onClick={() => setForm("new")}>
                <FiPlus /> Add food
              </Button>
            }
          />
        }
      />

      {form && (
        <FoodForm
          editing={form === "new" ? null : form}
          onClose={() => setForm(null)}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Delete "${toDelete?.name}"?`}
        description="This cannot be undone. Foods that appear in past orders can only be disabled."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
