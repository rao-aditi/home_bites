import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";

// Search / filter / sort / page state for a server-paginated table. Changing the
// search or any filter resets to page 1; the debounced search avoids a request per keystroke.
export function useListState(initialFilters = {}, { limit = 10 } = {}) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const debouncedSearch = useDebounce(search);

  const params = useMemo(() => {
    const p = { page, limit, ...sort };
    if (debouncedSearch.trim()) p.search = debouncedSearch.trim();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== "" && v != null && v !== "all") p[k] = v;
    }
    return p;
  }, [page, limit, sort, debouncedSearch, filters]);

  return {
    params,
    search,
    setSearch: (v) => {
      setSearch(v);
      setPage(1);
    },
    filters,
    setFilter: (key, value) => {
      setFilters((f) => ({ ...f, [key]: value }));
      setPage(1);
    },
    page,
    setPage,
    sort,
    setSort,
  };
}
