"use client";

import { IBookSection } from "@/types/generalTypes";
import useGet from "@/react-query/useGet";
import Loading from "@/components/Loading";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

interface SectionsResponse {
  sections: IBookSection[];
  meta: {
    total_count: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
}

export default function SectionsSidebar({
  bookId,
  activeOrderNo,
  onSelectSection,
}: {
  bookId: number;
  activeOrderNo: number | null;
  onSelectSection: (orderNo: number) => void;
}) {
  const { t } = useTranslation("global");
  const params = useParams();
  const locale = params?.locale as string;
  const isRTL = locale === "ar" || locale === "ku";
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGet<SectionsResponse, false>(
    `books/${bookId}/sections`,
    { page, per_page: 20 },
    true,
    `book-${bookId}-sections`,
  );

  const preview = (text: string, len: number) => {
    if (!text) return "";
    const txt = text.trim().replace(/\s+/g, " ");
    return txt.length > len ? txt.slice(0, len) + "…" : txt;
  };

  useEffect(() => {
    if (data?.sections?.length && activeOrderNo === null) {
      onSelectSection(data.sections[0].order_no);
    }
  }, [data, activeOrderNo, onSelectSection]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-card border-r border-border relative">
      <div
        className="h-[72px] sticky top-0 z-10 flex items-center justify-start p-4 border-b border-border bg-card font-bold text-sm tracking-wider uppercase text-muted-foreground shrink-0"
        dir="rtl"
      >
        {t("sections", { defaultValue: "Sections" })}
      </div>

      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        data-lenis-prevent
      >
        {isLoading ? (
          <div className="p-4 flex justify-center">
            <Loading />
          </div>
        ) : !data?.sections?.length ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {t("no_sections", { defaultValue: "No sections found." })}
          </div>
        ) : (
          <div className="flex flex-col">
            {data.sections.map((sec) => (
              <button
                key={sec.order_no}
                onClick={() => onSelectSection(sec.order_no)}
                className={cn(
                  "flex flex-col items-end p-3 border-b border-border text-right transition-colors hover:bg-accent hover:text-accent-foreground w-full cursor-pointer",
                  activeOrderNo === sec.order_no
                    ? "bg-accent border-r-4 border-r-primary"
                    : "border-r-4 border-r-transparent",
                )}
                dir="rtl"
              >
                <div className="text-xs text-muted-foreground mb-1">
                  #{sec.order_no}
                </div>
                <div className="text-sm font-medium line-clamp-2">
                  {sec.header_text || preview(sec.body_text, 60)}
                </div>
                {sec.image_count > 0 && (
                  <div className="mt-2 text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    {sec.image_count}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {data?.meta && data.meta.total_pages > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-border bg-card shrink-0 gap-2">
          <button
            className="p-1 px-3 bg-secondary text-secondary-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary/80 text-xs flex items-center transition-colors cursor-pointer"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {isRTL ? (
              <ChevronRight className="w-4 h-4 ml-1" />
            ) : (
              <ChevronLeft className="w-4 h-4 mr-1" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {page} / {data.meta.total_pages}
          </span>
          <button
            className="p-1 px-3 bg-secondary text-secondary-foreground rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-secondary/80 text-xs flex items-center transition-colors cursor-pointer"
            disabled={page >= data.meta.total_pages}
            onClick={() => setPage((p) => p + 1)}
          >
            {isRTL ? (
              <ChevronLeft className="w-4 h-4 mr-1" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
