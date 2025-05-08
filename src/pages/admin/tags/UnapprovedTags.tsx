import { IFilter, ITaggedAyah } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import SectionHeader from "@/components/SectionHeader";
import { TablePagination } from "@/components/TablePagination";
import {
  getQueryParams,
  setQueryParams,
  setQueryParamsByKey,
} from "@smart-gate/query-params";
import TableDropdown from "@/components/dropdown/TableDropdown";
import { ColumnDef } from "@tanstack/react-table";

import ApproveTagAttach from "@/components/dropdown/ApproveTagAttach";
import UnapproveTagAttach from "@/components/dropdown/UnapproveTagAttach";
import AppTooltip from "@/components/AppTooltip";
export default function UnapprovedTags() {
  const [filters, setFilters] = useState<IFilter>({});

  const { data, isLoading } = useGet<ITaggedAyah, true>(
    `tags/unapproved`,
    filters,
    true
  );
  useEffect(() => {
    setQueryParams(filters);
  }, [filters]);

  useEffect(() => {
    setQueryParamsByKey("per_page", "10");
    setQueryParamsByKey("page", "1");
    setFilters(getQueryParams());
  }, []);

  const tagsColumn: ColumnDef<ITaggedAyah>[] = [
    {
      accessorKey: "tag.name",
      id: "Tag",
      header: "Tag",
    },
    /*  {
      accessorKey: "tag.notes",
      id: "Note",
      header: "Note",
    }, */
    {
      id: "Ayah",
      enableSorting: false,
      accessorKey: "ayah.text",
      header: "Ayah",
      cell: ({ row }) => {
        return (
          <AppTooltip
            trigger={
              <div
                dir="rtl"
                className="max-w-[700px] font-quran-4 text-xl truncate overflow-hidden"
              >
                {row.original.ayah.text}
              </div>
            }
            className="text-base sm:text-lg font-medium text-center w-[600px]"
            content={row.original.ayah.text}
          />
        );
      },
    },
    {
      id: "actions",
      header: () => "",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <TableDropdown>
            <ApproveTagAttach id={row.original.id} />
            {false && <UnapproveTagAttach id={row.original.id} />}
          </TableDropdown>
        );
      },
    },
  ];

  return (
    <Card x-chunk="dashboard-06-chunk-0" className=" ">
      <SectionHeader title="Unapproved tags" role={[]} />

      <CardContent>
        <TableData
          sortBy={filters.sort_by || ""}
          setSortBy={setFilters}
          columns={tagsColumn}
          data={data?.result || []}
          isLoading={isLoading}
        />
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <TablePagination
          pageSize={filters.per_page || 10}
          currentPage={data?.meta?.current_page || 1}
          totalPages={data?.meta?.total_pages || 1}
          onPageChange={(newPage) => {
            setFilters((prev) => ({
              ...prev,
              page: newPage,
            }));
          }}
          onPageSizeChange={(newPageSize) => {
            setFilters((prev) => ({
              ...prev,
              per_page: newPageSize,
            }));
          }}
        />
      </CardFooter>
    </Card>
  );
}
