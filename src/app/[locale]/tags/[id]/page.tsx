import { Metadata } from "next";
import TagClient from "./TagClient";
import api from "@/api/axiosInstance";
import { Suspense } from "react";
import Loading from "@/components/Loading";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

import { getLocalizedMetadata } from "@/helpers/metadataHelper";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const { t } = getLocalizedMetadata(locale);

  try {
    const response = await api.get(`/tags/${id}`);
    const tag = response.data.data;

    return {
      title: t("Tag: {{name}} - Our Quran", { name: tag.name }),
      description: t("Explore ayahs tagged with {{name}} in the Quran.", {
        name: tag.name,
      }),
    };
  } catch (error) {
    return {
      title: t("Tag - Our Quran"),
    };
  }
}

export default async function TagPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <TagClient id={id} />
    </Suspense>
  );
}
