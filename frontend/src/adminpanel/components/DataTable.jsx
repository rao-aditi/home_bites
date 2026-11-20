import { FiChevronLeft, FiChevronRight, FiInbox } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "Nothing here yet",
  hint,
  icon: Icon = FiInbox,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-semibold">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>}
      {action}
    </div>
  );
}

export function Pagination({ pagination, onPage }) {
  if (!pagination) return null;
  const { page, totalPages, total, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 text-sm sm:flex-row">
      <p className="text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from}</span>–
        <span className="font-medium text-foreground">{to}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <FiChevronLeft /> Prev
        </Button>
        <span className="min-w-20 text-center text-muted-foreground">
          Page {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next <FiChevronRight />
        </Button>
      </div>
    </div>
  );
}

/**
 * columns: [{ key, header, cell?(row), className?, headClassName?, sortKey? }]
 * `data` is the paginated response ({ items, pagination }) or undefined while loading.
 */
export function DataTable({
  columns,
  data,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onPage,
  sort,
  onSort,
  empty,
  rowKey = (r) => r.id,
}) {
  const rows = data?.items ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div
        className={cn(
          "overflow-x-auto transition-opacity",
          isFetching && !isLoading && "opacity-60",
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((c) => {
                const sortable = c.sortKey && onSort;
                const active = sort?.sortBy === c.sortKey;
                return (
                  <TableHead
                    key={c.key}
                    className={cn(
                      "whitespace-nowrap",
                      sortable && "cursor-pointer select-none",
                      c.headClassName,
                    )}
                    onClick={
                      sortable
                        ? () =>
                            onSort({
                              sortBy: c.sortKey,
                              sortDir:
                                active && sort.sortDir === "asc"
                                  ? "desc"
                                  : "asc",
                            })
                        : undefined
                    }
                  >
                    {c.header}
                    {active && (
                      <span className="ml-1 text-primary">
                        {sort.sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={c.key}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading &&
              rows.map((row) => (
                <TableRow key={rowKey(row)}>
                  {columns.map((c) => (
                    <TableCell key={c.key} className={c.className}>
                      {c.cell ? c.cell(row) : row[c.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {isError && (
        <EmptyState
          title="Could not load data"
          hint="Check that the backend is running, then try again."
          action={
            onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Retry
              </Button>
            )
          }
        />
      )}
      {!isLoading &&
        !isError &&
        rows.length === 0 &&
        (empty || (
          <EmptyState
            title="No results found"
            hint="Try changing your search or filters."
          />
        ))}

      {!isError && <Pagination pagination={data?.pagination} onPage={onPage} />}
    </div>
  );
}
