"use client";

import Loading from "@/components/Loading";
import BookCard from "@/components/BookCard";
import { useTranslation } from "react-i18next";
import { BookLanguage, IBook } from "@/types/generalTypes";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams.get("language");
  const language: BookLanguage =
    requestedLanguage === "ar" || requestedLanguage === "ku"
      ? requestedLanguage
      : locale === "ar" ? "ar" : "ku";
  const pageParam = searchParams.get("page");
  const parsedPage = pageParam && /^\d+$/.test(pageParam) ? Number(pageParam) : 1;
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const updateQuery = (nextLanguage: BookLanguage, nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("language", nextLanguage);
    if (nextPage > 1) {
      params.set("page", String(nextPage));
    } else {
      params.delete("page");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

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
            onClick={() => updateQuery(lang, 1)}
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
                onClick={() => updateQuery(language, Math.max(1, page - 1))}
              >
                {t("previous", { defaultValue: "Previous" })}
              </button>
              <span className="text-sm">
                {page} / {data.meta.total_pages}
              </span>
              <button
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50"
                disabled={page >= data.meta.total_pages}
                onClick={() => updateQuery(language, page + 1)}
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
