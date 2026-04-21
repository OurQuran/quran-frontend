import MushafPageClient from "@/components/MushafPageClient";
import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pageNumber: string }>;
}): Promise<Metadata> {
  const { locale, pageNumber } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: `${t("Page")} ${pageNumber} - ${t("Our quran")}`,
    description: t("Read page {{page}} of the Holy Quran.", {
      page: pageNumber,
    }),
    path: `/surahs/page/${pageNumber}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ pageNumber: string }>;
}) {
  const { pageNumber } = await params;
  return <MushafPageClient pageNumber={pageNumber} />;
}
