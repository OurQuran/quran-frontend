import TagTree from "@/components/TagTree";
import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

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
    title: t("Explore Tags - Our Quran"),
    description: t("Explore all tags and topics mentioned in the Holy Quran."),
    path: "/tags",
  });
}

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function TagsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TagTree />
    </Suspense>
  );
}
