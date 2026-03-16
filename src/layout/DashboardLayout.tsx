"use client";

import {
  RouterTabNavLink,
  RouterTabs,
  RouterTabsList,
} from "@/components/RouterTabs";
import { hasPermissionClient } from "@/helpers/authGuards";
import { RoleTypeEnum } from "@/types/authTypes";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [t] = useTranslation("global");
  // Subscribe to user so the component re-renders when auth loads after refresh
  useAuthStore((state) => state.user);

  const routerTabItems = [
    {
      label: "Users",
      href: "users",
      permission: [RoleTypeEnum.SUPERADMIN],
    },
    {
      label: "All tags",
      href: "tags",
      permission: [RoleTypeEnum.ADMIN, RoleTypeEnum.SUPERADMIN],
    },
    {
      label: "Unapproved tags",
      href: "unapproved",
      permission: [RoleTypeEnum.ADMIN, RoleTypeEnum.SUPERADMIN],
    },
  ];

  const tabs = routerTabItems.map((tab, index) => {
    return (
      hasPermissionClient(tab.permission) && (
        <RouterTabNavLink
          key={"tab" + index}
          className="w-full"
          href={tab.href}
        >
          {t(tab.label)}
        </RouterTabNavLink>
      )
    );
  });

  return (
    <div className="w-full">
      <RouterTabs className="w-full mb-5">
        <RouterTabsList className="w-full justify-between gap-1">
          {tabs}
        </RouterTabsList>
      </RouterTabs>
      {children}
    </div>
  );
}
