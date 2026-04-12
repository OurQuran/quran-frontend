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

    const title = t("Surah {{name}} - Our Quran", { name: surah.name });
    const description = t(
      "Read and listen to Surah {{name}} with translations and audio.",
      { name: surah.name }
    );

    return {
      title,
      description,
      openGraph: { title, description, type: "website" },
      twitter: { card: "summary_large_image", title, description }
    };
  } catch (error) {
    const title = `${t("Surah")} - ${t("Our quran")}`;
    const description = t("Home_Page_Description", { defaultValue: "Read and listen to the Holy Quran with translations and interactive features." });
    return {
      title,
      description,
      openGraph: { title, description, type: "website" },
      twitter: { card: "summary_large_image", title, description }
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
