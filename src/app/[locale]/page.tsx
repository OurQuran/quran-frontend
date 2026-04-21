import HomeClient from "./HomeClient";
import api from "@/api/axiosInstance";
import { ISurahs } from "@/types/generalTypes";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

import { Suspense } from "react";
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
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("Our Quran - Read, Listen, and Search"),
    description: t(
      "A modern Quranic platform for reading, listening, and semantic search.",
    ),
  });
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
