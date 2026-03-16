import BookmarksClient from "./BookmarksClient";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return {
    title: t("My Bookmarks - Our Quran"),
    description: t("View and manage your bookmarked Quranic verses."),
  };
}

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function BookmarksPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BookmarksClient />
    </Suspense>
  );
}
