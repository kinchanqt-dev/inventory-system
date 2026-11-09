import type { ReactNode } from "react";

interface ResponsiveDataListProps {
  cards: ReactNode;
  table: ReactNode;
}

/** Cards below `md`, table from `md` up. Both stay in the DOM for CSS breakpoints. */
export function ResponsiveDataList({
  cards,
  table,
}: Readonly<ResponsiveDataListProps>) {
  return (
    <>
      <div className="space-y-3 md:hidden">{cards}</div>
      <div className="hidden md:block">{table}</div>
    </>
  );
}
