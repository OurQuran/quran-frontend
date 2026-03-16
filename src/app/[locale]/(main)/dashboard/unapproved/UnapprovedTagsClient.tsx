"use client";

import { IFilter, ITaggedAyah } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import SectionHeader from "@/components/SectionHeader";
import { TablePagination } from "@/components/TablePagination";
import TableDropdown from "@/components/dropdown/TableDropdown";
import { ColumnDef } from "@tanstack/react-table";
import ApproveTagAttach from "@/components/dropdown/ApproveTagAttach";
import AppTooltip from "@/components/AppTooltip";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function UnapprovedTagsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter>({
    page: parseInt(searchParams.get("page") || "1"),
    per_page: parseInt(searchParams.get("per_page") || "10"),
    sort_by: searchParams.get("sort_by") || "",
  });

  const [t] = useTranslation("global");

  const { data, isLoading } = useGet<ITaggedAyah, true>(
    `tags/unapproved`,
    filters,
    true
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.per_page) params.set("per_page", filters.per_page.toString());
    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router]);

  const tagsColumn: ColumnDef<ITaggedAyah>[] = [
    {
      accessorKey: "tag.name",
      id: "Tag",
      header: t("Tag"),
    },
    {
      id: "Ayah",
      enableSorting: false,
      accessorKey: "ayah.text",
      header: t("Ayah"),
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
          </TableDropdown>
        );
      },
    },
  ];

  return (
    <Card className=" ">
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
