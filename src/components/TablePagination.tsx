import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Layers } from "lucide-react";
import { Button } from "./ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className,
}: TablePaginationProps) {
  const generatePages = () => {
    const pages = [];

    if (currentPage > 3) {
      pages.push(1);
      pages.push("ellipsis");
    }

    for (
      let i = Math.max(1, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageSizeOptions = [10, 20, 50];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-4 rounded-md hover:bg-secondary transition-all py-0 px-3  text-muted-foreground hover:text-primary">
            <Layers className="w-5 h-5" />
            <Button
              variant="ghost"
              className="hover:bg-transparent p-0 hover:text-primary"
            >
              {pageSize}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {pageSizeOptions.map((size) => {
            return (
              <DropdownMenuCheckboxItem
                key={size + 2}
                checked={pageSize === size}
                className=" cursor-pointer"
                onCheckedChange={() => {
                  onPageSizeChange(size);
                }}
              >
                {size}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            />
          </PaginationItem>

          {generatePages().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
