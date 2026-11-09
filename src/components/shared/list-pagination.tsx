import { Button } from "@/components/ui/button";

interface ListPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function ListPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: Readonly<ListPaginationProps>) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  if (total <= pageSize) {
    return null;
  }

  const canPrev = page > 1;
  const canNext = page < pageCount;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground tabular-nums">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
