"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IBook } from "@/types/generalTypes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BookOpen } from "lucide-react";

export default function BookCard({
  book,
}: {
  book: IBook;
}) {
  const { t } = useTranslation("global");
  const { locale } = useParams();

  return (
    <Link href={`/${locale}/reading-books/books/${book.id}`} className="block h-full">
      <Card className="h-full w-full transition-all duration-200 hover:border-primary flex flex-col justify-center bg-card">
        <CardContent 
          className="flex items-center p-4 gap-4 h-full"
          dir={locale === "ar" || locale === "ku" ? "rtl" : "ltr"}
        >
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
            <BookOpen className="text-primary w-5 h-5" />
          </div>

          {/* Title */}
          <div className="flex-1 flex flex-col justify-center text-start">
            <div className="text-[1.05rem] font-bold leading-[1.6] line-clamp-2">
              {book.name}
            </div>
          </div>

          {/* Section Count Badge */}
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
    </Link>
  );
}
