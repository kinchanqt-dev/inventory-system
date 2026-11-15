import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function BreadcrumbSeparator({ show }: Readonly<{ show: boolean }>) {
  if (!show) {
    return null;
  }
  return <ChevronRight className="size-3.5 shrink-0" aria-hidden />;
}

function currentPageLabel(label: string) {
  return (
    <span aria-current="page" className="font-medium text-foreground">
      {label}
    </span>
  );
}

function plainBreadcrumbLabel(label: string) {
  return <span>{label}</span>;
}

function BreadcrumbCrumb({
  item,
  isLast,
}: Readonly<{ item: BreadcrumbItem; isLast: boolean }>) {
  if (isLast) {
    return currentPageLabel(item.label);
  }
  if (!item.href) {
    return plainBreadcrumbLabel(item.label);
  }

  return (
    <Link
      href={item.href}
      className="transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {item.label}
    </Link>
  );
}

export function PageBreadcrumb({
  items,
  className,
}: Readonly<PageBreadcrumbProps>) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="flex items-center gap-1.5"
          >
            <BreadcrumbSeparator show={index > 0} />
            <BreadcrumbCrumb
              item={item}
              isLast={index === items.length - 1}
            />
          </li>
        ))}
      </ol>
    </nav>
  );
}
