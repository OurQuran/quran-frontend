import { useState } from "react";
import {
  User,
  LogOut,
  Settings,
  Bookmark,
  Users,
  Tags,
  CheckCircle2,
  KeyRound,
  UserMinus,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
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
  icon?: React.ReactNode;
}

function HeaderProfile() {
  const [isUserUpsearOpen, setIsUserUpsearOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const authStore = useAuthStore();
  const { t, i18n } = useTranslation("global");
  const fontClass = i18n.language === "en" ? "font-poppins" : "font-kurdish";

  const menuItems: MenuItem[] = [
    {
      label: t("My Account"),
      icon: <User className="w-4 h-4" />,
      items: [
        {
          label: t("Edit Profile"),
          icon: <Settings className="w-4 h-4" />,
          onClick: () => {
            setIsDropdownOpen(false);
            setIsUserUpsearOpen(true);
          },
        },
        {
          label: t("Change Password"),
          icon: <KeyRound className="w-4 h-4" />,
          onClick: () => {
            setIsDropdownOpen(false);
            setIsPasswordOpen(true);
          },
        },
        {
          label: t("My Bookmarks"),
          icon: <Bookmark className="w-4 h-4" />,
          to: "/bookmarks",
        },
      ],
    },
    {
      label: t("Management"),
      icon: <CheckCircle2 className="w-4 h-4" />,
      permission: [RoleTypeEnum.ADMIN, RoleTypeEnum.SUPERADMIN],
      items: [
        {
          label: t("Users"),
          icon: <Users className="w-4 h-4" />,
          to: "/dashbaord/users",
          permission: [RoleTypeEnum.SUPERADMIN, RoleTypeEnum.USER],
        },
        {
          label: t("Tags"),
          icon: <Tags className="w-4 h-4" />,
          to: "/dashbaord/tags",
        },
        {
          label: t("Approve Tag assigns"),
          icon: <CheckCircle2 className="w-4 h-4" />,
          to: "/dashbaord/unapproved",
        },
      ],
    },
    {
      label: t("Actions"),
      items: [
        {
          label: t("Delete My Account"),
          icon: <UserMinus className="w-4 h-4 text-destructive" />,
          variant: "destructive",
          className: "text-destructive hover:bg-destructive/10",
          onClick: () => {
            setIsDropdownOpen(false);
            setIsDeleteAccountOpen(true);
          },
        },
        {
          label: t("Log out"),
          icon: <LogOut className="w-4 h-4 text-destructive" />,
          variant: "destructive",
          className: "text-destructive hover:bg-destructive/10",
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
          className={cn(
            item.className,
            fontClass,
            "flex items-center gap-2 cursor-pointer transition-colors duration-200",
          )}
          variant={item.variant || "default"}
          onClick={item.onClick ? item.onClick : () => {}}
        >
          {item.icon}
          <span>{item.label}</span>
        </DropdownMenuItem>
      );

      return (
        <div key={`${level}-${index}`}>
          {item.items ? (
            <>
              <DropdownMenuLabel
                className={cn(
                  item.className,
                  fontClass,
                  "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2",
                )}
              >
                {item.icon}
                {item.label}
              </DropdownMenuLabel>
              <DropdownMenuGroup className="px-1">
                {renderMenuGroup(item.items, level + 1)}
              </DropdownMenuGroup>
              {index < items.length - 1 && (
                <DropdownMenuSeparator className="my-2 bg-border/40" />
              )}
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
            variant="ghost"
            className={cn(
              "flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-primary bg-accent/20 hover:bg-accent/40 backdrop-blur-sm border border-border/50 shadow-xs",
              fontClass,
            )}
          >
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium hidden sm:inline">
              {authStore.user?.username}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 bg-card/95 backdrop-blur-md border-border/50 shadow-xl p-2"
          align="end"
          sideOffset={8}
        >
          {renderMenuGroup(menuItems)}
        </DropdownMenuContent>
      </DropdownMenu>

      {isUserUpsearOpen && (
        <UserUpsearModal
          isOpen={isUserUpsearOpen}
          setIsOpen={setIsUserUpsearOpen}
          selectedRecord={authStore.user}
          isSelf={true}
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
