import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiEdit2, FiPlus, FiTrash2, FiTag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  setCategoryActive,
} from "@/store/slice/AdminSlice/categorySlice";
import { useListState } from "../hooks/useListState";
import { DataTable, EmptyState } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { FormDialog } from "../components/FormDialog";
import { ImageUpload } from "../components/ImageUpload";
import {
  Field,
  FilterSelect,
  PageHeader,
  SearchBox,
  Thumb,
  Toolbar,
} from "../components/ui-kit";
import { errMessage } from "../lib/format";

const EMPTY = {
  name: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

function CategoryForm({ editing, onClose }) {
  const [form, setForm] = useState(editing ? { ...EMPTY, ...editing } : EMPTY);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { creating, updating } = useSelector((state) => state.adminCategory);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.image) e.image = "Please upload an image";
    setErrors(e);
    if (Object.keys(e).length) return;

    const body = {
      name: form.name,
      description: form.description,
      image: form.image,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };
    try {
      if (editing) await dispatch(updateCategory({ id: editing.id, ...body })).unwrap();
      else await dispatch(createCategory(body)).unwrap();
      toast.success(editing ? "Category updated" : "Category added");
      onClose();
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <FormDialog
      open
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "Edit category" : "Add category"}
      description="Enabled categories appear on the customer website immediately."
      onSubmit={submit}
      submitting={creating || updating}
    >
      <Field label="Name" required error={errors.name}>
        <Input
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          placeholder="e.g. Pizza"
        />
      </Field>
      <Field label="Description">
        <Textarea
          rows={3}
          value={form.description || ""}
          onChange={(e) => set("description")(e.target.value)}
        />
      </Field>
      <Field label="Image" required error={errors.image}>
        <ImageUpload
          value={form.image}
          onChange={set("image")}
          error={errors.image}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Display order" hint="Lower numbers are shown first.">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder")(e.target.value)}
          />
        </Field>
        <Field label="Enabled">
          <div className="flex h-9 items-center">
            <Switch checked={form.isActive} onCheckedChange={set("isActive")} />
          </div>
        </Field>
      </div>
    </FormDialog>
  );
}

export default function CategoriesPage() {
  const list = useListState({ isActive: "all" });
  const dispatch = useDispatch();
  const { list: data, loading: isFetching, deleting, error } = useSelector(
    (state) => state.adminCategory,
  );
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchCategories(list.params));

  useEffect(() => {
    dispatch(fetchCategories(list.params));
  }, [dispatch, list.params]);
  const [form, setForm] = useState(null); // null | "new" | category
  const [toDelete, setToDelete] = useState(null);

  const toggle = async (c, isActive) => {
    try {
      await dispatch(setCategoryActive({ id: c.id, isActive })).unwrap();
      toast.success(`${c.name} ${isActive ? "enabled" : "disabled"}`);
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCategory(toDelete.id)).unwrap();
      toast.success("Category deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(errMessage(err));
      setToDelete(null);
    }
  };

  const columns = [
    {
      key: "image",
      header: "",
      cell: (c) => <Thumb src={c.image} alt={c.name} />,
    },
    {
      key: "name",
      header: "Name",
      sortKey: "name",
      cell: (c) => (
        <div>
          <p className="font-semibold">{c.name}</p>
          {c.description && (
            <p className="max-w-xs truncate text-xs text-muted-foreground">
              {c.description}
            </p>
          )}
        </div>
      ),
    },
    { key: "sortOrder", header: "Order", sortKey: "sortOrder" },
    { key: "foods", header: "Foods", cell: (c) => c._count?.foods ?? 0 },
    {
      key: "isActive",
      header: "Enabled",
      cell: (c) => (
        <Switch checked={c.isActive} onCheckedChange={(v) => toggle(c, v)} />
      ),
    },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      cell: (c) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Edit"
            onClick={() => setForm(c)}
          >
            <FiEdit2 />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            className="text-destructive"
            onClick={() => setToDelete(c)}
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
        title="Categories"
        description="Organise your menu. Disabled categories (and their foods) are hidden from customers."
        actions={
          <Button onClick={() => setForm("new")}>
            <FiPlus /> Add category
          </Button>
        }
      />
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Search categories…"
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
            icon={FiTag}
            title="No categories found"
            hint="Add your first category to start building the menu."
            action={
              <Button size="sm" onClick={() => setForm("new")}>
                <FiPlus /> Add category
              </Button>
            }
          />
        }
      />

      {form && (
        <CategoryForm
          editing={form === "new" ? null : form}
          onClose={() => setForm(null)}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title={`Delete "${toDelete?.name}"?`}
        description="This cannot be undone. Categories that still contain foods cannot be deleted."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
