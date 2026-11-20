import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchOrders,
  fetchOrder,
  updateOrderStatus,
} from "@/store/slice/AdminSlice/orderSlice";
import { useListState } from "../hooks/useListState";
import { DataTable, EmptyState } from "../components/DataTable";
import {
  FilterSelect,
  PageHeader,
  Pill,
  SearchBox,
  Thumb,
  Toolbar,
} from "../components/ui-kit";
import {
  ORDER_STATUSES,
  errMessage,
  fmtDateTime,
  money,
  statusMeta,
} from "../lib/format";

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}

function OrderDetail({ id, onClose }) {
  const dispatch = useDispatch();
  const {
    order: storedOrder,
    orderError,
    updatingStatus: saving,
  } = useSelector((state) => state.adminOrder);
  // Only show the stored order if it is the one that was opened.
  const order = storedOrder?.id === id ? storedOrder : undefined;
  const isLoading = !order && !orderError;
  const isError = Boolean(orderError);

  useEffect(() => {
    dispatch(fetchOrder(id));
  }, [dispatch, id]);
  const finished = order && ["delivered", "cancelled"].includes(order.status);

  const change = async (status) => {
    try {
      await dispatch(updateOrderStatus({ id, status })).unwrap();
      toast.success(`Order marked ${statusMeta(status).label}`);
    } catch (err) {
      toast.error(errMessage(err));
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order #{id.slice(-6).toUpperCase()}</DialogTitle>
          <DialogDescription>
            {order ? fmtDateTime(order.createdAt) : "Loading…"}
          </DialogDescription>
        </DialogHeader>

        {isLoading && <Skeleton className="h-64 w-full" />}
        {isError && <EmptyState title="Could not load this order" />}
        {order && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Pill tone={statusMeta(order.status).tone}>
                  {statusMeta(order.status).label}
                </Pill>
              </div>
              {finished ? (
                <span className="text-xs text-muted-foreground">
                  This order is final and cannot be changed.
                </span>
              ) : (
                <Select
                  value={order.status}
                  onValueChange={change}
                  disabled={saving}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-3 text-sm">
                <p className="mb-1 font-semibold">Customer</p>
                <p>{order.user?.name}</p>
                <p className="text-muted-foreground">{order.user?.email}</p>
                <p className="text-muted-foreground">{order.addressPhone}</p>
              </div>
              <div className="rounded-xl border p-3 text-sm">
                <p className="mb-1 font-semibold">
                  Delivery address · {order.addressLabel}
                </p>
                <p>{order.addressLine1}</p>
                <p className="text-muted-foreground">{order.addressCity}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Items</p>
              <ul className="divide-y rounded-xl border">
                {order.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3 p-3">
                    <Thumb src={it.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{it.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {money(it.price)} × {it.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {money(it.price * it.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 rounded-xl bg-muted/50 p-4">
              <Row label="Subtotal" value={money(order.subtotal)} />
              <Row label="GST" value={money(order.gst)} />
              <Row label="Delivery fee" value={money(order.deliveryFee)} />
              <Row label="Platform fee" value={money(order.platformFee)} />
              <Row label="Packaging fee" value={money(order.packagingFee)} />
              {order.tip > 0 && <Row label="Tip" value={money(order.tip)} />}
              {order.discount > 0 && (
                <Row
                  label={`Discount${order.couponCode ? ` (${order.couponCode})` : ""}`}
                  value={`−${money(order.discount)}`}
                />
              )}
              <div className="border-t pt-2">
                <Row label="Total" value={money(order.total)} bold />
              </div>
              <Row label="Payment method" value={order.paymentMethod} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage() {
  const [searchParams] = useSearchParams();
  const list = useListState({
    status: searchParams.get("status") || "all",
    from: "",
    to: "",
  });
  const dispatch = useDispatch();
  const { list: data, loading: isFetching, error } = useSelector((state) => state.adminOrder);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchOrders(list.params));

  useEffect(() => {
    dispatch(fetchOrders(list.params));
  }, [dispatch, list.params]);
  const [selected, setSelected] = useState(null);

  const columns = [
    {
      key: "id",
      header: "Order",
      cell: (o) => (
        <span className="font-mono font-semibold">
          #{o.id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      cell: (o) => (
        <div>
          <p className="font-medium">{o.user?.name}</p>
          <p className="text-xs text-muted-foreground">{o.user?.email}</p>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      cell: (o) => o.items.reduce((n, i) => n + i.quantity, 0),
    },
    {
      key: "total",
      header: "Total",
      sortKey: "total",
      cell: (o) => <span className="font-semibold">{money(o.total)}</span>,
    },
    {
      key: "payment",
      header: "Payment",
      cell: (o) => <span className="capitalize">{o.paymentMethod}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (o) => {
        const s = statusMeta(o.status);
        return <Pill tone={s.tone}>{s.label}</Pill>;
      },
    },
    {
      key: "createdAt",
      header: "Placed",
      sortKey: "createdAt",
      cell: (o) => (
        <span className="whitespace-nowrap text-xs">
          {fmtDateTime(o.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (o) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="View order"
          onClick={() => setSelected(o.id)}
        >
          <FiEye />
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track and update customer orders."
      />
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Order ID, customer, phone…"
        />
        <FilterSelect
          value={list.filters.status}
          onChange={(v) => list.setFilter("status", v)}
          allLabel="All statuses"
          options={ORDER_STATUSES.map((s) => ({
            value: s.value,
            label: s.label,
          }))}
        />
        <div className="flex items-center gap-2">
          <Input
            type="date"
            aria-label="From date"
            className="w-40"
            value={list.filters.from}
            onChange={(e) => list.setFilter("from", e.target.value)}
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            aria-label="To date"
            className="w-40"
            value={list.filters.to}
            onChange={(e) => list.setFilter("to", e.target.value)}
          />
        </div>
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
            icon={FiShoppingBag}
            title="No orders found"
            hint="Orders appear here as customers place them."
          />
        }
      />
      {selected && (
        <OrderDetail id={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
