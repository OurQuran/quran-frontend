import AdvancedSearchClient from "./AdvancedSearchClient";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return {
    title: t("Advanced Search - Our Quran"),
    description: t("Enter your search query to find relevant verses"),
  };
}

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function AdvancedSearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AdvancedSearchClient />
    </Suspense>
  );
}
