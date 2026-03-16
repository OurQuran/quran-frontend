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
