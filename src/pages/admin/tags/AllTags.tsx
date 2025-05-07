import { IFilter, ITagDashbaord } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import SectionHeader from "@/components/SectionHeader";
import { RoleTypeEnum } from "@/types/authTypes";
import { TablePagination } from "@/components/TablePagination";
import { getQueryParams, setQueryParams } from "@smart-gate/query-params";
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
export default function AllTags() {
  const [filters, setFilters] = useState<IFilter>({
    page: 1,
    per_page: 10,
    ...getQueryParams(),
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
    setQueryParams(filters);
  }, [filters]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedTag(null);
    }
  }, [isOpen]);

  const tagsColumn: ColumnDef<ITagDashbaord>[] = [
    {
      accessorKey: "name",
      id: "name",
      header: "name",
    },
    {
      id: "creator",
      enableSorting: false,
      accessorKey: "creator.username",
      header: "creator",
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
      id: "updater",
      enableSorting: false,
      accessorKey: "updater.username",
      header: "updater",
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
      id: "parent",
      enableSorting: false,
      accessorKey: "parent.username",
      header: "parent",
      cell: ({ row }) => {
        return (
          <Badge className="w-full">{row.original.parent?.name || "_"}</Badge>
        );
      },
    },
    {
      id: "children",
      accessorKey: "children_count",
      header: "children",
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
    <Card x-chunk="dashboard-06-chunk-0" className=" ">
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
