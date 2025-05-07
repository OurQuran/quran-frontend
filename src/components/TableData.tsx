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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Eye } from "lucide-react";
import { IFilter } from "@/types/generalTypes";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  sortBy: string | null;
  setSortBy: any;
}

export default function TableData<TData, TValue>({
  columns,
  data,
  isLoading,
  sortBy,
  setSortBy,
}: DataTableProps<TData, TValue>) {
  const [t] = useTranslation("global");

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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
