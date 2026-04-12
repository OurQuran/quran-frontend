/** @reactCompilerDisableMemoization */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loading from "./Loading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Eye, ChevronDown, ChevronRight } from "lucide-react";
import { IFilter } from "@/types/generalTypes";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  sortBy: string | null;
  setSortBy: any;
  onRowClick?: (data: TData) => void;
  renderRowDetails?: (data: TData) => React.ReactNode;
}

export default function TableData<TData, TValue>({
  columns,
  data,
  isLoading,
  sortBy,
  setSortBy,
  onRowClick,
  renderRowDetails,
}: DataTableProps<TData, TValue>) {
  const [t] = useTranslation("global");

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="space-y-4">
      {/* Table */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const columnId = header.column.id;
                const canSort = header.column.getCanSort();
                if (columnId == "actions") {
                  return (
                    <TableHead className="text-start bg-muted" key={header.id}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="hover:bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                checked={column.getIsVisible()}
                                className="rounded-none cursor-pointer"
                                onCheckedChange={(value) => {
                                  column.toggleVisibility(value);
                                }}
                                onSelect={(e) => e.preventDefault()}
                              >
                                {t(column.columnDef.id as string)}
                              </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableHead>
                  );
                }
                return (
                  <TableHead className="text-start bg-muted" key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={() => {
                          if (canSort) {
                            const newSortBy =
                              sortBy === columnId ? null : columnId;
                            setSortBy((prev: IFilter) => ({
                              ...prev,
                              sort_by: newSortBy,
                            }));
                          }
                        }}
                        className={`flex items-center gap-5 w-full group ${
                          canSort && "cursor-pointer"
                        }`}
                      >
                        {typeof header.column.columnDef.header == "function"
                          ? flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          : t(header.column.columnDef.header as string)}
                        {canSort && (
                          <ArrowUpDown
                            className={`w-4 h-4 ml-1 ${
                              sortBy === columnId
                                ? "opacity-100 text-primary"
                                : "opacity-0 group-hover:opacity-100 transition-all"
                            }`}
                          />
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow className="hover:bg-transparent">
              <TableCell className="text-center" colSpan={columns.length}>
                <Loading className="w-52 h-52" />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <React.Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    if (renderRowDetails) {
                      setExpandedRowId(expandedRowId === row.id ? null : row.id);
                    }
                    onRowClick?.(row.original);
                  }}
                  className={cn(
                    (onRowClick || renderRowDetails) && "cursor-pointer transition-all",
                    renderRowDetails && expandedRowId === row.id ? "bg-muted/30" : "hover:bg-muted/50"
                  )}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell key={cell.id}>
                      <div className="flex items-center gap-2">
                        {index === 0 && renderRowDetails && (
                          <div className="shrink-0 text-muted-foreground">
                            {expandedRowId === row.id ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                            )}
                          </div>
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                {renderRowDetails && expandedRowId === row.id && (
                  <TableRow className="hover:bg-transparent border-b-2 border-primary/20">
                    <TableCell colSpan={columns.length} className="p-0">
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        {renderRowDetails(row.original)}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-center" colSpan={columns.length}>
                {t("No Results")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
