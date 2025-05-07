import {
  RouterTabNavLink,
  RouterTabs,
  RouterTabsList,
} from "@/components/RouterTabs";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
export default function DashboardLayout() {
  const [t] = useTranslation("global");

  const routerTabItems = [
    {
      label: "Users",
      href: "users",
    },
    {
      label: "All tags",
      href: "tags",
    },
    {
      label: "Unapproved tags",
      href: "unapproved",
    },
  ];

  const tabs = routerTabItems.map((tab, index) => {
    return (
      <RouterTabNavLink
        key={"tab" + index}
        end
        className="w-full"
        to={tab.href}
      >
        {t(tab.label)}
      </RouterTabNavLink>
    );
  });
  return (
    <div className="w-full">
      <RouterTabs className="w-full mb-5">
        <RouterTabsList className="w-full justify-between gap-1">
          {tabs}
        </RouterTabsList>
      </RouterTabs>
      <Outlet />
    </div>
  );
}
