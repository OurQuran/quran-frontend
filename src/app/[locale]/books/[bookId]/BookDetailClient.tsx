"use client";

import { useState } from "react";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import SectionsSidebar from "@/components/Books/SectionsSidebar";
import SectionContent from "@/components/Books/SectionContent";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BookDetailClient() {
  const { t } = useTranslation("global");
  const params = useParams();
  const bookId = parseInt(params.bookId as string);
  const isRTL = params.locale === "ar" || params.locale === "ku";

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const sectionParam = searchParams.get("section");
  const activeOrderNo = sectionParam && !isNaN(parseInt(sectionParam)) 
    ? parseInt(sectionParam) 
    : null;

  const setActiveOrderNo = (orderNo: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", orderNo.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  if (isNaN(bookId)) {
    return (
      <div className="p-8 text-center text-destructive">
        {t("invalid_book_id", { defaultValue: "Invalid Book ID" })}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden absolute inset-0 bg-black/50 z-20 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "absolute md:relative z-30 h-full w-[280px] lg:w-[320px] transition-transform duration-300 ease-in-out shrink-0 bg-card",
          isRTL ? "right-0" : "left-0",
          isSidebarOpen
            ? "translate-x-0"
            : isRTL
              ? "translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-none"
              : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-none",
        )}
      >
        <button
          className={cn(
            "md:hidden absolute top-3 p-1 rounded-full bg-secondary text-secondary-foreground z-40",
            isRTL ? "left-3" : "right-3",
          )}
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className={cn(
            "h-full w-[280px] lg:w-[320px]",
            !isSidebarOpen && "md:hidden",
          )}
        >
          <SectionsSidebar
            bookId={bookId}
            activeOrderNo={activeOrderNo}
            onSelectSection={(orderNo) => {
              setActiveOrderNo(orderNo);
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
              }
            }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full bg-background relative">
        <button
          className={cn(
            "absolute top-4 z-20 p-2 bg-secondary/80 backdrop-blur text-secondary-foreground rounded-md hover:bg-secondary transition-colors md:flex shadow-sm",
            isRTL ? "left-4" : "right-4",
            isSidebarOpen && "md:hidden", // Hide button on desktop if sidebar is open
          )}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <SectionContent bookId={bookId} orderNo={activeOrderNo} />
      </div>
    </div>
  );
}
