import { useState } from "react";
import { User } from "lucide-react";
import { Link } from "react-router";
import { hasPermissionClient } from "@/helpers/authGuards";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { RoleTypeEnum } from "@/types/authTypes";
import { UserUpsearModal } from "./UserUpseartModal";
import ChangePasswordModal from "./dropdown/ChangePasswordModal";
import DeleteAccoun from "./dropdown/DeleteAccount";
import Logout from "./dropdown/Logout";

interface MenuItem {
  label: string;
  to?: string;
  permission?: RoleTypeEnum | RoleTypeEnum[];
  items?: MenuItem[];
  variant?: "destructive" | "default";
  onClick?: () => void;
  className?: string;
}

function HeaderProfile() {
  const [isUserUpsearOpen, setIsUserUpsearOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const authStore = useAuthStore();
  const [t] = useTranslation("globL");

  const menuItems: MenuItem[] = [
    {
      label: t("My Account"),
      items: [
        {
          label: t("Edit Profile"),
          onClick: () => {
            setIsDropdownOpen(false);
            setIsUserUpsearOpen(true);
          },
        },
        {
          label: t("Change Password"),
          onClick: () => {
            setIsDropdownOpen(false);
            setIsPasswordOpen(true);
          },
        },
        {
          label: t("My Bookmarks"),
          to: "/bookmarks",
        },
      ],
    },
    {
      label: t("Management"),

      permission: [RoleTypeEnum.ADMIN, RoleTypeEnum.SUPERADMIN],
      items: [
        {
          label: t("Users"),
          to: "/dashbaord/users",
          permission: [RoleTypeEnum.SUPERADMIN, RoleTypeEnum.USER],
        },
        {
          label: t("Tags"),
          to: "/dashbaord/tags",
        },
        {
          label: t("Approve Tag assigns"),
          to: "/dashbaord/unapproved",
        },
      ],
    },
    {
      label: t("Actions"),

      items: [
        {
          label: t("Delete My Account"),
          variant: "destructive",
          onClick: () => {
            setIsDropdownOpen(false);
            setIsDeleteAccountOpen(true);
          },
        },
        {
          label: t("Log out"),
          variant: "destructive",
          onClick: () => {
            setIsDropdownOpen(false);
            setIsLogoutOpen(true);
          },
        },
      ],
    },
  ];

  function renderMenuGroup(items: MenuItem[], level: number = 0) {
    return items.map((item, index) => {
      if (item.permission && !hasPermissionClient(item.permission)) {
        return null;
      }

      const menuItem = (
        <DropdownMenuItem
          className={item.className}
          variant={item.variant || "default"}
          onClick={item.onClick ? item.onClick : () => {}}
        >
          {item.label}
        </DropdownMenuItem>
      );

      return (
        <div key={`${level}-${index}`}>
          {item.items ? (
            <>
              <DropdownMenuLabel className={item.className}>
                {item.label}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {renderMenuGroup(item.items, level + 1)}
              </DropdownMenuGroup>
              {index < items.length - 1 && <DropdownMenuSeparator />}
            </>
          ) : item.to ? (
            <Link className="w-full" to={item.to}>
              {menuItem}
            </Link>
          ) : (
            menuItem
          )}
        </div>
      );
    });
  }

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className="rounded-4xl text-primary hover:bg-transparent"
          >
            <User className="w-6 h-6 text-primary" />
            {authStore.user?.username}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {renderMenuGroup(menuItems)}
        </DropdownMenuContent>
      </DropdownMenu>

      {isUserUpsearOpen && (
        <UserUpsearModal
          isOpen={isUserUpsearOpen}
          setIsOpen={setIsUserUpsearOpen}
          selectedRecord={authStore.user}
        />
      )}
      {isPasswordOpen && (
        <ChangePasswordModal
          id={authStore.user.id + "" || ""}
          setIsOpen={setIsPasswordOpen}
          isOpen={isPasswordOpen}
          isSelf={true}
        />
      )}
      {isDeleteAccountOpen && (
        <DeleteAccoun
          setIsOpen={setIsDeleteAccountOpen}
          isOpen={isDeleteAccountOpen}
        />
      )}
      {isLogoutOpen && (
        <Logout setIsOpen={setIsLogoutOpen} isOpen={isLogoutOpen} />
      )}
    </>
  );
}

export default HeaderProfile;
