import { CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { SquarePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hasPermissionClient } from "@/helpers/authGuards";
import { RoleTypeEnum } from "@/types/authTypes";
import { Link } from "react-router";

export default function SectionHeader({
  title,
  role,
  children,
}: {
  title: string;
  role?: RoleTypeEnum | RoleTypeEnum[];
  children?: React.ReactNode;
}) {
  const [t] = useTranslation("global");

  return (
    <CardHeader className="flex w-full gap-5 justify-between">
      <div className="flex w-full items-center justify-between">
        <CardTitle className="text-xl">{t(title)}</CardTitle>
        {role && hasPermissionClient(role) && children ? (
          children
        ) : role && hasPermissionClient(role) ? (
          <Link to="upsert">
            <Button>
              <SquarePlus />
              <span className="px-2 hidden sm:inline">{t("Add")}</span>
            </Button>
          </Link>
        ) : null}
      </div>
    </CardHeader>
  );
}
