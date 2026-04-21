import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

import { Suspense } from "react";
import Loading from "@/components/Loading";
import AdvancedSearchClient from "./AdvancedSearchClient";

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
    title: t("Advanced Search - Our Quran"),
    description: t(
      "Search the Holy Quran with advanced filters and semantic search.",
    ),
    path: "/advanced-search",
  });
}
export default async function AdvancedSearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdvancedSearchClient />
    </Suspense>
  );
}
