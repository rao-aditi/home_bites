import { useEffect } from "react";
import { FiHeart, FiUsers, FiCoffee } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFoodOptions } from "@/store/slice/AdminSlice/foodSlice";
import { fetchCustomerOptions } from "@/store/slice/AdminSlice/customerSlice";
import { fetchWishlist, fetchWishlistStats } from "@/store/slice/AdminSlice/wishlistSlice";
import { useListState } from "../hooks/useListState";
import { DataTable, EmptyState } from "../components/DataTable";
import {
  FilterSelect,
  PageHeader,
  Pill,
  SearchBox,
  StatCard,
  Thumb,
  Toolbar,
} from "../components/ui-kit";
import { money } from "../lib/format";

// Read-only: admins monitor wishlists but never edit a customer's personal list.
export default function WishlistPage() {
  const dispatch = useDispatch();
  const list = useListState({ userId: "all", foodId: "all" });
  const {
    list: data,
    loading: isFetching,
    error,
    stats: s,
    statsError,
  } = useSelector((state) => state.adminWishlist);
  const foods = useSelector((state) => state.adminFood.options);
  const customers = useSelector((state) => state.adminCustomer.options);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const statsLoading = !s && !statsError;
  const refetch = () => dispatch(fetchWishlist(list.params));

  useEffect(() => {
    dispatch(fetchWishlist(list.params));
  }, [dispatch, list.params]);

  useEffect(() => {
    dispatch(fetchWishlistStats());
    dispatch(fetchFoodOptions({ limit: 100, sortBy: "name", sortDir: "asc" }));
    dispatch(fetchCustomerOptions({ limit: 100, sortBy: "name", sortDir: "asc" }));
  }, [dispatch]);

  const columns = [
    {
      key: "customer",
      header: "Customer",
      cell: (w) => (
        <div>
          <p className="font-medium">{w.user.name}</p>
          <p className="text-xs text-muted-foreground">{w.user.email}</p>
        </div>
      ),
    },
    {
      key: "food",
      header: "Food",
      cell: (w) => (
        <div className="flex items-center gap-3">
          <Thumb src={w.food.image} />
          <span className="font-medium">{w.food.name}</span>
        </div>
      ),
    },
    { key: "price", header: "Price", cell: (w) => money(w.food.price) },
  ];

  return (
    <>
      <PageHeader
        title="Wishlist insights"
        description="See what customers are saving. This view is read-only."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          loading={statsLoading}
          label="Saved items"
          value={s?.totalEntries}
          icon={FiHeart}
        />
        <StatCard
          loading={statsLoading}
          label="Customers with a wishlist"
          value={s?.customersWithWishlist}
          icon={FiUsers}
          tone="info"
        />
        <StatCard
          loading={statsLoading}
          label="Different foods saved"
          value={s?.uniqueFoods}
          icon={FiCoffee}
          tone="success"
        />
      </div>

      <Card className="mt-6 overflow-hidden shadow-soft">
        <div className="border-b px-5 py-3.5 font-bold">
          Most wishlisted foods
        </div>
        {statsLoading ? (
          <Skeleton className="m-4 h-24" />
        ) : !s?.mostWishlisted?.length ? (
          <EmptyState title="No wishlist activity yet" />
        ) : (
          <ul className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
            {s.mostWishlisted.map((f, i) => (
              <li key={f.id} className="flex items-center gap-3 bg-card p-4">
                <span className="w-5 text-sm font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <Thumb src={f.image} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{f.name}</p>
                </div>
                <Pill tone="danger">♥ {f.count}</Pill>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <h2 className="mb-3 mt-8 text-lg font-bold">Who saved what</h2>
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Search customer or food…"
        />
        <FilterSelect
          value={list.filters.userId}
          onChange={(v) => list.setFilter("userId", v)}
          allLabel="All customers"
          options={customers.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
        />
        <FilterSelect
          value={list.filters.foodId}
          onChange={(v) => list.setFilter("foodId", v)}
          allLabel="All foods"
          options={foods.map((f) => ({
            value: f.id,
            label: f.name,
          }))}
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
        empty={<EmptyState icon={FiHeart} title="No wishlist entries match" />}
      />
    </>
  );
}
