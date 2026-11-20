import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiEye, FiUsers } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchCustomers,
  fetchCustomer,
  setCustomerActive,
} from "@/store/slice/AdminSlice/customerSlice";
import { useListState } from "../hooks/useListState";
import { DataTable, EmptyState } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  FilterSelect,
  PageHeader,
  Pill,
  SearchBox,
  Toolbar,
} from "../components/ui-kit";
import {
  errMessage,
  fmtDate,
  fmtDateTime,
  money,
  statusMeta,
} from "../lib/format";

function CustomerDetail({ id, onClose }) {
  const dispatch = useDispatch();
  const { customer, customerError } = useSelector((state) => state.adminCustomer);
  // Only show the stored customer if it is the one that was opened.
  const c = customer?.id === id ? customer : undefined;
  const isLoading = !c && !customerError;
  const isError = Boolean(customerError);

  useEffect(() => {
    dispatch(fetchCustomer(id));
  }, [dispatch, id]);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{c?.name || "Customer"}</DialogTitle>
          <DialogDescription>{c?.email}</DialogDescription>
        </DialogHeader>
        {isLoading && <Skeleton className="h-48 w-full" />}
        {isError && <EmptyState title="Could not load this customer" />}
        {c && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Orders", c._count.orders],
                ["Total spent", money(c.totalSpent)],
                ["Wishlist", c._count.wishlistItems],
                ["Joined", fmtDate(c.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-bold">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Pill tone={c.isActive ? "success" : "danger"}>
                {c.isActive ? "Active" : "Deactivated"}
              </Pill>
              {c.phone && (
                <span className="text-muted-foreground">{c.phone}</span>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Addresses</p>
              {c.addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No saved addresses.
                </p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {c.addresses.map((a) => (
                    <li key={a.id} className="rounded-lg border p-2.5">
                      <span className="font-medium">{a.label}</span> — {a.line1}
                      , {a.city} · {a.phone}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Order history</p>
              {c.orders.length === 0 ? (
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              ) : (
                <ul className="divide-y rounded-xl border">
                  {c.orders.map((o) => {
                    const st = statusMeta(o.status);
                    return (
                      <li
                        key={o.id}
                        className="flex items-center justify-between gap-3 p-3 text-sm"
                      >
                        <div>
                          <p className="font-mono font-semibold">
                            #{o.id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {fmtDateTime(o.createdAt)} · {o.items.length}{" "}
                            item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {money(o.total)}
                          </span>
                          <Pill tone={st.tone}>{st.label}</Pill>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CustomersPage() {
  const list = useListState({ isActive: "all" });
  const dispatch = useDispatch();
  const { list: data, loading: isFetching, toggling: saving, error } = useSelector(
    (state) => state.adminCustomer,
  );
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchCustomers(list.params));

  useEffect(() => {
    dispatch(fetchCustomers(list.params));
  }, [dispatch, list.params]);
  const [selected, setSelected] = useState(null);
  const [pending, setPending] = useState(null); // { customer, isActive }

  const apply = async () => {
    try {
      await dispatch(
        setCustomerActive({
          id: pending.customer.id,
          isActive: pending.isActive,
        }),
      ).unwrap();
      toast.success(
        `${pending.customer.name} ${pending.isActive ? "activated" : "deactivated"}`,
      );
    } catch (err) {
      toast.error(errMessage(err));
    }
    setPending(null);
  };

  const columns = [
    {
      key: "name",
      header: "Customer",
      sortKey: "name",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
            {c.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", cell: (c) => c.phone || "—" },
    { key: "orders", header: "Orders", cell: (c) => c._count.orders },
    {
      key: "createdAt",
      header: "Joined",
      sortKey: "createdAt",
      cell: (c) => fmtDate(c.createdAt),
    },
    {
      key: "status",
      header: "Status",
      cell: (c) => (
        <Pill tone={c.isActive ? "success" : "danger"}>
          {c.isActive ? "Active" : "Deactivated"}
        </Pill>
      ),
    },
    {
      key: "active",
      header: "Active",
      cell: (c) => (
        <Switch
          checked={c.isActive}
          onCheckedChange={(v) => setPending({ customer: c, isActive: v })}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (c) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="View"
          onClick={() => setSelected(c.id)}
        >
          <FiEye />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        description="Registered customers. Deactivated accounts cannot sign in."
      />
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Name, email or phone…"
        />
        <FilterSelect
          value={list.filters.isActive}
          onChange={(v) => list.setFilter("isActive", v)}
          allLabel="All accounts"
          options={[
            { value: "true", label: "Active" },
            { value: "false", label: "Deactivated" },
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
        empty={<EmptyState icon={FiUsers} title="No customers found" />}
      />
      {selected && (
        <CustomerDetail id={selected} onClose={() => setSelected(null)} />
      )}
      <ConfirmDialog
        open={!!pending}
        onOpenChange={(v) => !v && setPending(null)}
        title={`${pending?.isActive ? "Activate" : "Deactivate"} ${pending?.customer.name}?`}
        description={
          pending?.isActive
            ? "They will be able to sign in and order again."
            : "They will be signed out and unable to sign in or place orders."
        }
        confirmLabel={pending?.isActive ? "Activate" : "Deactivate"}
        destructive={!pending?.isActive}
        loading={saving}
        onConfirm={apply}
      />
    </>
  );
}
