import { Metadata } from "next";
import HomeClient from "./HomeClient";
import api from "@/api/axiosInstance";
import { ISurahs } from "@/types/generalTypes";
import { initI18n } from "@/translation/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  const title = `${t("Home")} - ${t("Our quran")}`;
  const description = t("Home_Page_Description", { defaultValue: "Read and listen to the Holy Quran with translations and interactive features." });

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description }
  };
}

async function getSurahs(filters: any) {
  try {
    const response = await api.get("/surahs", { params: filters });
    return response.data.data as ISurahs[];
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return [];
  }
}

import Loading from "@/components/Loading";

export default async function HomePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const sParams = await searchParams;

  const filters = {
    name: sParams.name,
    type: sParams.type,
    revelation_order: sParams.revelation_order,
  };

  const initialData = await getSurahs(filters);

  return (
    <Suspense fallback={<Loading />}>
      <HomeClient initialData={initialData} />
    </Suspense>
  );
}
