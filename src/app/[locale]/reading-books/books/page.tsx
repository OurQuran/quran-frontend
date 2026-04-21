import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";
import BooksClient from "./BooksClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("Reading Books - Our Quran"),
    description: t("Explore various Quranic qira'ats and reading books."),
    path: "/reading-books/books",
  });
}

export default function BooksPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BooksClient />
    </Suspense>
  );
}
