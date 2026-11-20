import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiCoffee,
  FiTag,
  FiPercent,
  FiClock,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchDashboard } from "@/store/slice/AdminSlice/dashboardSlice";
import { PageHeader, Pill, StatCard, Thumb } from "../components/ui-kit";
import { EmptyState } from "../components/DataTable";
import { fmtDate, money, statusMeta } from "../lib/format";

function Panel({ title, action, children }) {
  return (
    <Card className="overflow-hidden shadow-soft">
      <div className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { dashboard: data, error } = useSelector((state) => state.adminDashboard);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchDashboard());

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);
  const s = data?.stats;

  if (isError) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <EmptyState
          title="Could not load the dashboard"
          hint="Check that the backend is running."
          action={
            <Button variant="outline" onClick={refetch}>
              Retry
            </Button>
          }
        />
      </>
    );
  }

  const chart = (data?.salesOverview || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A live overview of your HomeBites business."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          loading={isLoading}
          label="Total orders"
          value={s?.totalOrders}
          icon={FiShoppingBag}
        />
        <StatCard
          loading={isLoading}
          label="Total revenue"
          value={money(s?.totalRevenue)}
          icon={FiDollarSign}
          tone="success"
        />
        <StatCard
          loading={isLoading}
          label="Customers"
          value={s?.totalCustomers}
          icon={FiUsers}
          tone="info"
        />
        <StatCard
          loading={isLoading}
          label="Pending orders"
          value={s?.pendingOrders}
          icon={FiClock}
          tone="warning"
        />
        <StatCard
          loading={isLoading}
          label="Foods"
          value={s?.totalFoods}
          icon={FiCoffee}
        />
        <StatCard
          loading={isLoading}
          label="Categories"
          value={s?.totalCategories}
          icon={FiTag}
          tone="info"
        />
        <StatCard
          loading={isLoading}
          label="Active offers"
          value={s?.activeOffers}
          icon={FiPercent}
          tone="success"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel title="Sales overview · last 14 days">
            <div className="h-72 p-4">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chart}
                    margin={{ left: -10, right: 8, top: 8 }}
                  >
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--primary)"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      stroke="var(--muted-foreground)"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      stroke="var(--muted-foreground)"
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                      }}
                      formatter={(v, name) =>
                        name === "revenue"
                          ? [money(v), "Revenue"]
                          : [v, "Orders"]
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#rev)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Panel>
        </div>

        <Panel title="Most popular foods">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.popularFoods.length === 0 ? (
            <EmptyState
              title="No sales yet"
              hint="Popular foods appear once orders come in."
            />
          ) : (
            <ul className="divide-y">
              {data.popularFoods.map((f, i) => (
                <li key={f.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-5 text-sm font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <Thumb src={f.image} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {money(f.price)}
                    </p>
                  </div>
                  <Pill tone="primary">{f.sold} sold</Pill>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent orders"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/orders">View all</Link>
            </Button>
          }
        >
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.recentOrders.length === 0 ? (
            <EmptyState title="No orders yet" />
          ) : (
            <ul className="divide-y">
              {data.recentOrders.map((o) => {
                const st = statusMeta(o.status);
                return (
                  <li
                    key={o.id}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        #{o.id.slice(-6).toUpperCase()} · {o.user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {o.items.length} item(s) · {fmtDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">
                        {money(o.total)}
                      </span>
                      <Pill tone={st.tone}>{st.label}</Pill>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Recent customers"
          action={
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/customers">View all</Link>
            </Button>
          }
        >
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : data.recentCustomers.length === 0 ? (
            <EmptyState title="No customers yet" />
          ) : (
            <ul className="divide-y">
              {data.recentCustomers.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                      {c.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.email}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {fmtDate(c.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
