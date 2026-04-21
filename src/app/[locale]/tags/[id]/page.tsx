import { Metadata, Viewport } from "next";
import TagClient from "./TagClient";
import api from "@/api/axiosInstance";
import { Suspense } from "react";
import Loading from "@/components/Loading";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

import JsonLd from "@/components/JsonLd";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateBreadcrumbSchema,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

import { getTagData } from "@/services/dataService";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const { t } = getLocalizedMetadata(locale);

  const tag = await getTagData(id);
  if (tag) {
    return generateCompleteMetadata({
      locale,
      title: t("Tag: {{name}} - Our Quran", { name: tag.name }),
      description: t("Explore ayahs tagged with {{name}} in the Quran.", {
        name: tag.name,
      }),
      path: `/tags/${id}`,
      type: "article",
    });
  }

  return generateCompleteMetadata({
    locale,
    title: t("Tag - Our Quran"),
    description: t("Explore various topics in the Holy Quran."),
    path: `/tags/${id}`,
  });
}

export default async function TagPage({ params }: PageProps) {
  const { id, locale } = await params;
  const tagData = await getTagData(id);

  const breadcrumbLd = generateBreadcrumbSchema([
    { name: "Home", url: `/${locale}` },
    { name: "Tags", url: `/${locale}/tags` },
    { name: tagData?.name || "Tag", url: `/${locale}/tags/${id}` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbLd} />
      <Suspense fallback={<Loading />}>
        <TagClient id={id} />
      </Suspense>
    </>
  );
}
