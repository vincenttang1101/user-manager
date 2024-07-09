import { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LuArrowUpDown } from "react-icons/lu";
import { cn } from "@/libs/utils";
import { Loading } from "@/components/common/Loading";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => ReactNode);
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  classNameWrapper?: string;
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading,
  classNameWrapper,
  className,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || typeof column.accessor !== "string") return;

    if (sortColumn === column.accessor) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
    } else {
      setSortColumn(column.accessor);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div
      className={cn(
        "relative flex max-h-[80vh] min-h-[150px] flex-col overflow-auto rounded-[12px] border border-[#343B4F]",
        classNameWrapper
      )}
    >
      <Table className={cn(className, "overflow-scroll")}>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`${column.width} ${
                  column.sortable ? "cursor-pointer" : ""
                }`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.header}
                  {column.sortable && (
                    <span className="ml-2">
                      {sortColumn === column.accessor && (
                        <LuArrowUpDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, cellIndex) => (
                <TableCell key={cellIndex} className="py-5">
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : (item[column.accessor] as ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {!isLoading && data.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length}>
                <div className="flex items-center justify-center h-[150px] text-2xl font-semibold">
                  No data available
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loading className="h-24 w-24" />
        </div>
      )}
    </div>
  );
}
