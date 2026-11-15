import { formatPesos } from "@/lib/money";

interface SalesListCardChangeProps {
  changeCents: number;
}

export function SalesListCardChange({
  changeCents,
}: Readonly<SalesListCardChangeProps>) {
  return (
    <div className="col-span-2">
      <dt className="text-xs text-muted-foreground">Change</dt>
      <dd className="tabular-nums">{formatPesos(changeCents)}</dd>
    </div>
  );
}