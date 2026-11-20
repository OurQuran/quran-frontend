"use client";

import Loading from "@/components/Loading";
import BookCard from "@/components/BookCard";
import { useTranslation } from "react-i18next";
import { BookLanguage, IBook } from "@/types/generalTypes";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import useGet from "@/react-query/useGet";

interface BooksResponse {
  books: IBook[];
  meta: {
    total_count: number;
    total_pages: number;
    current_page: number;
    page_size: number;
  };
}

export default function BooksClient() {
  const { t } = useTranslation("global");
  const { locale } = useParams();
  const [page, setPage] = useState(1);
  // Arabic UI -> Arabic editions; everything else starts on the Kurdish editions. The user can switch.
  const [language, setLanguage] = useState<BookLanguage>(locale === "ar" ? "ar" : "ku");

  const { data, isLoading } = useGet<BooksResponse, false>("books", {
    page,
    per_page: 20,
    language,
  });

  const languages: BookLanguage[] = ["ku", "ar"];

  return (
    <div>
      <div
        role="tablist"
        aria-label={t("book_language_label", { defaultValue: "Book language" })}
        className="mb-6 inline-flex rounded-lg bg-muted p-1"
      >
        {languages.map((lang) => (
          <button
            key={lang}
            type="button"
            role="tab"
            aria-selected={language === lang}
            onClick={() => {
              setLanguage(lang);
              setPage(1);
            }}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              language === lang
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(`book_language_${lang}`, {
              defaultValue: lang === "ku" ? "Kurdish edition" : "Arabic edition",
            })}
          </button>
        ))}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {!data?.books?.length ? (
            <div className="text-center text-muted-foreground mt-10">
              {t("no_books_found", { defaultValue: "No books found." })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {data?.meta && data.meta.total_pages > 1 && (
            <div className="flex justify-center mt-8 gap-4 items-center">
              <button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                {t("previous", { defaultValue: "Previous" })}
              </button>
              <span className="text-sm">
                {page} / {data.meta.total_pages}
              </span>
              <button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
                disabled={page >= data.meta.total_pages}
                onClick={() => setPage(p => p + 1)}
              >
                {t("next", { defaultValue: "Next" })}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
