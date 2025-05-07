import { IFilter, IUser } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import SectionHeader from "@/components/SectionHeader";
import { RoleTypeEnum } from "@/types/authTypes";
import { TablePagination } from "@/components/TablePagination";
import { getQueryParams, setQueryParams } from "@smart-gate/query-params";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { formatStringDate } from "@/helpers/utils";
import TableDropdown from "@/components/dropdown/TableDropdown";
import Delete from "@/components/dropdown/Delete";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserUpsearModal } from "@/components/UserUpseartModal";
import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import ChangePasswordModal from "@/components/dropdown/ChangePasswordModal";

export default function Users() {
  const [t] = useTranslation("global");
  const [filters, setFilters] = useState<IFilter>({
    page: 1,
    per_page: 10,
    ...getQueryParams(),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const { data, isLoading } = useGet<IUser, true>(`users`, filters);

  useEffect(() => {
    setQueryParams(filters);
  }, [filters]);

  useEffect(() => {
    if (!isOpen && !isPasswordOpen) {
      setSelectedUser(null);
    }
  }, [isOpen, isPasswordOpen]);

  const usersColumn: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      id: "name",
      header: "name",
    },
    {
      accessorKey: "username",
      id: "username",
      header: "username",
    },
    {
      id: "role",
      enableSorting: false,
      accessorKey: "role",
      header: "role",

      cell: ({ row }) => {
        return (
          <Badge className="bg-green-600 font-normal w-full hover:bg-green-700">
            {t(row.original.role || "")}
          </Badge>
        );
      },
    },
    {
      id: "created_at",
      enableSorting: true,
      accessorKey: "created_at",
      header: "created_at",
      cell: ({ row }) => {
        return formatStringDate(row.original.created_at || "");
      },
    },
    {
      id: "updated_at",
      enableSorting: true,
      accessorKey: "updated_at",
      header: "updated_at",
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
    <Card x-chunk="dashboard-06-chunk-0" className=" ">
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
