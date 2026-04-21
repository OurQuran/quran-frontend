import { Metadata, Viewport } from "next";
import SurahClient from "./SurahClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

import JsonLd from "@/components/JsonLd";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateSurahSchema,
  generateBreadcrumbSchema,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

import { getSurahData } from "@/services/dataService";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const { t } = getLocalizedMetadata(locale);
  const surah = await getSurahData(id);

  if (surah) {
    const title = t("Surah {{name}} - Our Quran", { name: surah.name });
    const description = t(
      "Read and listen to Surah {{name}} with translations and audio.",
      { name: surah.name },
    );

    return generateCompleteMetadata({
      locale,
      title,
      description,
      path: `/surah/${id}`,
      type: "article",
    });
  }

  return generateCompleteMetadata({
    locale,
    title: `${t("Surah")} - ${t("Our quran")}`,
    description: t(
      "Read and listen to the Holy Quran with translations and interactive features.",
    ),
    path: `/surah/${id}`,
  });
}

export default async function SurahPage({ params }: PageProps) {
  const { id, locale } = await params;
  const surahData = await getSurahData(id);

  const jsonLd = surahData ? generateSurahSchema(surahData, locale) : null;
  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Surahs", url: `/${locale}/surahs` },
    { name: surahData?.name || "Surah", url: `/${locale}/surah/${id}` },
  ]);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <JsonLd data={breadcrumbLd} />
      <Suspense fallback={<Loading />}>
        <SurahClient id={id} />
      </Suspense>
    </>
  );
}
