import { Metadata } from "next";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import api from "@/api/axiosInstance";
import BookDetailClient from "./BookDetailClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; bookId: string }>;
}): Promise<Metadata> {
  const { locale, bookId } = await params;
  const { t } = getLocalizedMetadata(locale);

  try {
    const response = await api.get(`/books/${bookId}`);
    const book = response.data?.data;
    const title = `${book?.name || t("Book")} - ${t("Our quran")}`;
    const description = t("Book_Description", { defaultValue: "Read this book on Our Quran." });
    return {
      title,
      description,
      openGraph: { title, description, type: "book" },
      twitter: { card: "summary_large_image", title, description },
    };
  } catch (error) {
    const title = `${t("Book")} - ${t("Our quran")}`;
    const description = t("Book_Description", { defaultValue: "Read this book on Our Quran." });
    return {
      title,
      description,
      openGraph: { title, description, type: "book" },
      twitter: { card: "summary_large_image", title, description }
    };
  }
}

export default function BookDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookDetailClient />
    </Suspense>
  );
}
