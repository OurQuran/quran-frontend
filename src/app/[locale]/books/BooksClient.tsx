"use client";

import Loading from "@/components/Loading";
import BookCard from "@/components/BookCard";
import { useTranslation } from "react-i18next";
import { IBook } from "@/types/generalTypes";
import { useState } from "react";
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
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGet<BooksResponse, false>("books", { page, per_page: 20 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("books", { defaultValue: "Books" })}</h1>
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
