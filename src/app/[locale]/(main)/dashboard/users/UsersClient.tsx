"use client";

import { IFilter, IUser } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import SectionHeader from "@/components/SectionHeader";
import { RoleTypeEnum } from "@/types/authTypes";
import { TablePagination } from "@/components/TablePagination";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { formatStringDate } from "@/helpers/utils";
import { cn } from "@/lib/utils";
import TableDropdown from "@/components/dropdown/TableDropdown";
import Delete from "@/components/dropdown/Delete";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserUpsearModal } from "@/components/UserUpseartModal";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import ChangePasswordModal from "@/components/dropdown/ChangePasswordModal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function UsersClient() {
  const { t, i18n } = useTranslation("global");
  const fontClass = i18n.language === "en" ? "font-poppins" : "font-kurdish";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter>({
    page: parseInt(searchParams.get("page") || "1"),
    per_page: parseInt(searchParams.get("per_page") || "10"),
    sort_by: searchParams.get("sort_by") || "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { data, isLoading } = useGet<IUser, true>(`users`, filters);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.per_page) params.set("per_page", filters.per_page.toString());
    if (filters.sort_by) params.set("sort_by", filters.sort_by);
    
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    if (!isOpen && !isPasswordOpen) {
      setSelectedUser(null);
    }
  }, [isOpen, isPasswordOpen]);

  const usersColumn: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      id: "name",
      header: t("Name"),
    },
    {
      accessorKey: "username",
      id: "username",
      header: t("Username"),
    },
    {
      id: "role",
      enableSorting: false,
      accessorKey: "role",
      header: t("Role"),

      cell: ({ row }) => {
        return (
          <Badge className={cn("bg-green-600 font-normal w-full hover:bg-green-700", fontClass)}>
            {t(row.original.role || "")}
          </Badge>
        );
      },
    },
    {
      id: "created_at",
      enableSorting: true,
      accessorKey: "created_at",
      header: t("Created At"),
      cell: ({ row }) => {
        return formatStringDate(row.original.created_at || "");
      },
    },
    {
      id: "updated_at",
      enableSorting: true,
      accessorKey: "updated_at",
      header: t("Updated At"),
      cell: ({ row }) => {
        return formatStringDate(row.original.updated_at || "");
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
                setSelectedUser(row.original);
                setIsOpen(true);
              }}
            >
              {t("Edit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setIsPasswordOpen(true);
                setSelectedUser(row.original);
              }}
            >
              {t("Change Password")}
            </DropdownMenuItem>
            <Delete id={row.original.id} path="users" />
          </TableDropdown>
        );
      },
    },
  ];

  return (
    <Card className=" ">
      <SectionHeader title="Users" role={[RoleTypeEnum.SUPERADMIN]}>
        <Button onClick={() => setIsOpen(true)}>
          <SquarePlus />
          <span className="px-2 hidden sm:inline">{t("Add")}</span>
        </Button>
      </SectionHeader>
      <CardContent>
        <TableData
          sortBy={filters.sort_by || ""}
          setSortBy={setFilters}
          columns={usersColumn}
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
        <UserUpsearModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedRecord={selectedUser}
        />
      )}
      {isPasswordOpen && (
        <ChangePasswordModal
          id={selectedUser?.id + "" || ""}
          setIsOpen={setIsPasswordOpen}
          isOpen={isPasswordOpen}
        />
      )}
    </Card>
  );
}
