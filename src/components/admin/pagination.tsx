import Link from "next/link";

export function Pagination({
  page,
  pageSize,
  total,
  makeHref,
}: {
  page: number;
  pageSize: number;
  total: number;
  makeHref: (page: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const linkClass =
    "rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted-strong transition-colors hover:border-bone/40 hover:text-bone";
  const disabledClass = "rounded-lg border border-line px-3 py-1.5 text-xs text-muted opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className="mt-4 flex flex-wrap items-center justify-between gap-3"
    >
      <p className="text-xs text-muted">
        Page {page} of {totalPages} · {total} record{total === 1 ? "" : "s"}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={makeHref(page - 1)} className={linkClass} rel="prev">
            Previous
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            Previous
          </span>
        )}
        {page < totalPages ? (
          <Link href={makeHref(page + 1)} className={linkClass} rel="next">
            Next
          </Link>
        ) : (
          <span className={disabledClass} aria-disabled="true">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
