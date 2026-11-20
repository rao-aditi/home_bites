import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiStar, FiTrash2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { fetchFoodOptions } from "@/store/slice/AdminSlice/foodSlice";
import {
  fetchReviews,
  setReviewHidden,
  deleteReview,
} from "@/store/slice/AdminSlice/reviewSlice";
import { useListState } from "../hooks/useListState";
import { DataTable, EmptyState } from "../components/DataTable";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  FilterSelect,
  PageHeader,
  Pill,
  SearchBox,
  Thumb,
  Toolbar,
} from "../components/ui-kit";
import { errMessage, fmtDate } from "../lib/format";

const Stars = ({ n }) => (
  <span className="whitespace-nowrap text-primary" aria-label={`${n} out of 5`}>
    {"★".repeat(n)}
    <span className="text-muted-foreground/40">{"★".repeat(5 - n)}</span>
  </span>
);

export default function ReviewsPage() {
  const list = useListState({ foodId: "all", rating: "all", isHidden: "all" });
  const dispatch = useDispatch();
  const { list: data, loading: isFetching, deleting, error } = useSelector(
    (state) => state.adminReview,
  );
  const foods = useSelector((state) => state.adminFood.options);
  const isLoading = !data && !error;
  const isError = Boolean(error);
  const refetch = () => dispatch(fetchReviews(list.params));

  useEffect(() => {
    dispatch(fetchReviews(list.params));
  }, [dispatch, list.params]);

  useEffect(() => {
    dispatch(fetchFoodOptions({ limit: 100, sortBy: "name", sortDir: "asc" }));
  }, [dispatch]);
  const [toDelete, setToDelete] = useState(null);

  const toggle = async (r) => {
    try {
      await dispatch(setReviewHidden({ id: r.id, isHidden: !r.isHidden })).unwrap();
      toast.success(
        r.isHidden ? "Review is visible again" : "Review hidden from customers",
      );
    } catch (err) {
      toast.error(errMessage(err));
    }
  };
  const confirmDelete = async () => {
    try {
      await dispatch(deleteReview(toDelete.id)).unwrap();
      toast.success("Review deleted");
    } catch (err) {
      toast.error(errMessage(err));
    }
    setToDelete(null);
  };

  const columns = [
    {
      key: "food",
      header: "Food",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <Thumb src={r.food.image} />
          <span className="font-medium">{r.food.name}</span>
        </div>
      ),
    },
    {
      key: "user",
      header: "Customer",
      cell: (r) => (
        <div>
          <p className="font-medium">{r.user.name}</p>
          <p className="text-xs text-muted-foreground">{r.user.email}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortKey: "rating",
      cell: (r) => <Stars n={r.rating} />,
    },
    {
      key: "comment",
      header: "Review",
      cell: (r) => (
        <p className="max-w-sm text-sm">
          {r.comment || (
            <span className="text-muted-foreground">No comment</span>
          )}
        </p>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      sortKey: "createdAt",
      cell: (r) => fmtDate(r.createdAt),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <Pill tone={r.isHidden ? "danger" : "success"}>
          {r.isHidden ? "Hidden" : "Visible"}
        </Pill>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            title={r.isHidden ? "Show" : "Hide"}
            aria-label="Toggle visibility"
            onClick={() => toggle(r)}
          >
            {r.isHidden ? <FiEye /> : <FiEyeOff />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete"
            className="text-destructive"
            onClick={() => setToDelete(r)}
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
        title="Reviews & ratings"
        description={
          data?.summary
            ? `Average rating ${data.summary.averageRating.toFixed(1)} across ${data.summary.visibleReviews} visible review(s).`
            : "Moderate what customers say about your food."
        }
      />
      <Toolbar>
        <SearchBox
          value={list.search}
          onChange={list.setSearch}
          placeholder="Search comments or customers…"
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
        <FilterSelect
          value={list.filters.rating}
          onChange={(v) => list.setFilter("rating", v)}
          allLabel="Any rating"
          options={[5, 4, 3, 2, 1].map((n) => ({
            value: String(n),
            label: `${n} star${n > 1 ? "s" : ""}`,
          }))}
        />
        <FilterSelect
          value={list.filters.isHidden}
          onChange={(v) => list.setFilter("isHidden", v)}
          allLabel="Visible & hidden"
          options={[
            { value: "false", label: "Visible" },
            { value: "true", label: "Hidden" },
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
            icon={FiStar}
            title="No reviews yet"
            hint="Reviews appear when customers rate your foods."
          />
        }
      />
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(v) => !v && setToDelete(null)}
        title="Delete this review?"
        description="This permanently removes the review. Hiding it is reversible."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
