import { Metadata, Viewport } from "next";
import api from "@/api/axiosInstance";
import BookDetailClient from "./BookDetailClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import JsonLd from "@/components/JsonLd";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateBookSchema,
  generateBreadcrumbSchema,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

import { getBookData } from "@/services/dataService";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; bookId: string }>;
}): Promise<Metadata> {
  const { locale, bookId } = await params;
  const { t } = getLocalizedMetadata(locale);

  if (isNaN(parseInt(bookId))) {
    return { title: t("Page Not Found") };
  }

  const book = await getBookData(bookId);
  if (book) {
    const title = t("Meta_Book_Title", { name: book?.name || t("Book") });
    const description = t("Meta_Book_Description", {
      name: book?.name || t("Book"),
    });

    return generateCompleteMetadata({
      locale,
      title,
      description,
      path: `/reading-books/books/${bookId}`,
      type: "book",
    });
  }

  return generateCompleteMetadata({
    locale,
    title: `${t("Book")} - ${t("Our quran")}`,
    description: t("Read the book on Our Quran platform."),
    path: `/reading-books/books/${bookId}`,
  });
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string; locale: string }>;
}) {
  const { bookId, locale } = await params;

  if (isNaN(parseInt(bookId))) {
    notFound();
  }

  const bookData = await getBookData(bookId);

  const jsonLd = bookData ? generateBookSchema(bookData, locale) : null;
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Books", url: `/${locale}/reading-books/books` },
    {
      name: bookData?.name || "Book",
      url: `/${locale}/reading-books/books/${bookId}`,
    },
  ]);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <JsonLd data={breadcrumbLd} />
      <Suspense fallback={<Loading />}>
        <BookDetailClient bookId={parseInt(bookId)} />
      </Suspense>
    </>
  );
}
