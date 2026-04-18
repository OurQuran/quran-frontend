"use client";

import { useTranslation } from "react-i18next";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReadingBooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation("global");
  const { locale } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const isListPage =
    pathname === `/${locale}/reading-books/books` ||
    pathname === `/${locale}/reading-books/qiraats`;

  if (!isListPage) {
    return <>{children}</>;
  }

  const currentTab = pathname.includes("/qiraats") ? "qiraats" : "books";

  return (
    <div className="flex flex-col gap-6">
      <Tabs
        value={currentTab}
        onValueChange={(value) =>
          router.push(`/${locale}/reading-books/${value}`)
        }
        className="w-full"
      >
        <TabsList className="w-full">
          <TabsTrigger value="books">{t("Origins")}</TabsTrigger>
          <TabsTrigger value="qiraats">{t("Farsh")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-2">{children}</div>
    </div>
  );
}
