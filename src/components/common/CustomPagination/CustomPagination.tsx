import { Link } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { createQueryString } from "@/libs/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CustomPaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageSizeChange: (newPageSize: number) => void;
  className?: string;
};

const createPaginationLink = (
  pageIndex: number,
  currentPage: number,
  pageSize: number
) => (
  <PaginationItem key={pageIndex}>
    <Link
      to={createQueryString({ pageIndex, pageSize })}
      className={`rounded-md px-3 py-2 ${
        currentPage === pageIndex
          ? "bg-primary text-primary-foreground"
          : "hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      {pageIndex}
    </Link>
  </PaginationItem>
);

export default function CustomPagination({
  currentPage,
  totalItems,
  pageSize,
  onPageSizeChange,
  className,
}: CustomPaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const renderPaginationItems = () => {
    const items = [];

    items.push(createPaginationLink(1, currentPage, pageSize));

    if (currentPage > 3) items.push(<PaginationEllipsis key="ellipsis-1" />);

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(createPaginationLink(i, currentPage, pageSize));
    }

    if (currentPage < totalPages - 2)
      items.push(<PaginationEllipsis key="ellipsis-2" />);

    if (totalPages > 1)
      items.push(createPaginationLink(totalPages, currentPage, pageSize));

    return items;
  };

  return (
    <div className={`flex flex-col items-end gap-6 ${className}`}>
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <Link
              to={createQueryString({
                pageIndex: Math.max(1, currentPage - 1),
                pageSize,
              })}
              className={`rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
                currentPage === 1 || totalPages === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              Previous
            </Link>
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <Link
              to={createQueryString({
                pageIndex: Math.min(Math.max(1, totalPages), currentPage + 1),
                pageSize,
              })}
              className={`rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
                currentPage === totalPages || totalPages === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              Next
            </Link>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex items-center">
        <span>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[6, 12, 18, 24, 30].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
