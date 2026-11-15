import { TableCell, TableRow } from "@/components/ui/table";

interface TableEmptyRowProps {
  colSpan: number;
  message: string;
}

export function TableEmptyRow({
  colSpan,
  message,
}: Readonly<TableEmptyRowProps>) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="py-10 text-center text-sm text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}