import { Metadata } from "next";
import SurahClient from "./SurahClient";
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
    const response = await api.get(`/surahs/${id}`);
    const surah = response.data.data;

    return {
      title: t("Surah {{name}} - Our Quran", { name: surah.name }),
      description: t(
        "Read and listen to Surah {{name}} with translations and audio.",
        { name: surah.name },
      ),
    };
  } catch (error) {
    return {
      title: t("Surah - Our Quran"),
    };
  }
}

export default async function SurahPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <SurahClient id={id} />
    </Suspense>
  );
}
