"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IBook } from "@/types/generalTypes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookOpen, Download, ShieldCheck, UserRound } from "lucide-react";

export default function BookCard({
  book,
}: {
  book: IBook;
}) {
  const { t } = useTranslation("global");
  const { locale } = useParams();

  return (
    <Card className="h-full w-full transition-all duration-200 hover:border-primary flex flex-col justify-center bg-card">
      <CardContent
        className="flex items-start p-4 gap-4 h-full"
        dir={locale === "ar" || locale === "ku" ? "rtl" : "ltr"}
      >
        <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mt-0.5">
          <BookOpen className="text-primary w-5 h-5" />
        </div>

        <div className="flex-1 flex flex-col gap-2 text-start min-w-0">
          <Link
            href={`/${locale}/reading-books/books/${book.id}`}
            className="group"
          >
            <div className="text-[1.05rem] font-bold leading-[1.6] line-clamp-2 group-hover:text-primary transition-colors">
              {book.name}
            </div>
          </Link>

          <div className="space-y-1 text-xs text-muted-foreground">
            {book.author_name && (
              <div className="flex items-center gap-1.5 min-w-0">
                <UserRound className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{book.author_name}</span>
              </div>
            )}
            {book.supervisor_name && (
              <div className="flex items-center gap-1.5 min-w-0">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{book.supervisor_name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            {book.download_url && book.has_pdf && (
              <a
                href={book.download_url}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                download
              >
                <Download className="h-3.5 w-3.5" />
                {t("Download PDF", { defaultValue: "Download PDF" })}
              </a>
            )}
          </div>
        </div>

        <div className="shrink-0 flex flex-col items-center justify-center border-s border-border ps-4 min-w-14">
          <div className="text-lg font-bold text-primary leading-none mb-1 mt-0.5">
            {book.section_count}
          </div>
          <div className="text-[0.65rem] text-muted-foreground whitespace-nowrap uppercase tracking-wider block">
            {t("sections", { defaultValue: "Sections" })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
