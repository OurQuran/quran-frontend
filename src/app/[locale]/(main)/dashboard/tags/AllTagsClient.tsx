"use client";

import { IFilter, ITagDashbaord } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import SectionHeader from "@/components/SectionHeader";
import { RoleTypeEnum } from "@/types/authTypes";
import { TablePagination } from "@/components/TablePagination";
import { AyahUpsertModal } from "@/components/AyahUpseartModal";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import TableDropdown from "@/components/dropdown/TableDropdown";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Delete from "@/components/dropdown/Delete";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function AllTagsClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter>({
    page: parseInt(searchParams.get("page") || "1"),
    per_page: parseInt(searchParams.get("per_page") || "10"),
    sort_by: searchParams.get("sort_by") || "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<ITagDashbaord | null>(null);
  const [t] = useTranslation("global");

  const { data, isLoading } = useGet<ITagDashbaord, true>(
    `tags/dashboard`,
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

  useEffect(() => {
    if (!isOpen) {
      setSelectedTag(null);
    }
  }, [isOpen]);

  const tagsColumn: ColumnDef<ITagDashbaord>[] = [
    {
      accessorKey: "name",
      id: "Name",
      header: t("Name"),
    },
    {
      id: "Creator",
      enableSorting: false,
      accessorKey: "creator.username",
      header: t("Creator"),
      cell: ({ row }) => {
        return row.original.creator ? (
          <HoverCard>
            <HoverCardTrigger className="hover:underline">
              {row.original.creator.username}
            </HoverCardTrigger>
            <HoverCardContent className="w-50">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-md font-semibold">
                    {row.original.creator.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {row.original.creator.username} |{" "}
                    <Badge className="rounded-lg" variant={"secondary"}>
                      {row.original.creator.role}
                    </Badge>
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : null;
      },
    },
    {
      id: "Updater",
      enableSorting: false,
      accessorKey: "updater.username",
      header: t("Updater"),
      cell: ({ row }) => {
        return row.original.updater ? (
          <HoverCard>
            <HoverCardTrigger className="hover:underline">
              {row.original.updater.username}
            </HoverCardTrigger>
            <HoverCardContent className="w-50">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-md font-semibold">
                    {row.original.updater.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {row.original.updater.username} |{" "}
                    <Badge className="rounded-lg" variant={"secondary"}>
                      {row.original.updater.role}
                    </Badge>
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ) : null;
      },
    },
    {
      id: "Parent",
      enableSorting: false,
      accessorKey: "parent.username",
      header: t("Parent"),
      cell: ({ row }) => {
        return (
          <Badge className="w-full">{row.original.parent?.name || "_"}</Badge>
        );
      },
    },
    {
      id: "Children",
      accessorKey: "children_count",
      header: t("Children"),
      cell: ({ row }) => {
        return (
          <Badge variant={"secondary"} className="w-full">
            {row.original.children_count || "_"}
          </Badge>
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
            <DropdownMenuItem
              onClick={() => {
                setSelectedTag(row.original);
                setIsOpen(true);
              }}
            >
              {t("Edit")}
            </DropdownMenuItem>
            <Delete id={row.original.id} path="tags" />
          </TableDropdown>
        );
      },
    },
  ];

  return (
    <Card className=" ">
      <SectionHeader
        title="Tags"
        role={[RoleTypeEnum.SUPERADMIN, RoleTypeEnum.ADMIN]}
      >
        <Button onClick={() => setIsOpen(true)}>
          <SquarePlus />
          <span className="px-2 hidden sm:inline">{t("Add")}</span>
        </Button>
      </SectionHeader>

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
      {isOpen && (
        <AyahUpsertModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedTag={selectedTag}
        />
      )}
    </Card>
  );
}
