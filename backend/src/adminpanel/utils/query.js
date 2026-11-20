// Shared list-query helpers: pagination, sorting and a uniform paginated response.
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  return { page, limit, skip: (page - 1) * limit, take: limit };
}

// Only allow sorting on whitelisted fields so clients can't probe arbitrary columns.
function parseSort(query, allowed, fallback = { createdAt: "desc" }) {
  const field = query.sortBy;
  if (!field || !allowed.includes(field)) return fallback;
  return { [field]: query.sortDir === "asc" ? "asc" : "desc" };
}

function paginated(items, total, { page, limit }) {
  return {
    items,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

const contains = (value) => ({ contains: value, mode: "insensitive" });

const parseBool = (v) => (v === "true" ? true : v === "false" ? false : undefined);

module.exports = { parsePagination, parseSort, paginated, contains, parseBool };
