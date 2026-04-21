import { Metadata, Viewport } from "next";
import BookmarksClient from "./BookmarksClient";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("My Bookmarks - Our Quran"),
    description: t("View and manage your bookmarked Quranic verses."),
    path: "/bookmarks",
  });
}

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookmarksClient />
    </Suspense>
  );
}
