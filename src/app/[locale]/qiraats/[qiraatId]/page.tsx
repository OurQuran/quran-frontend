import { Metadata } from "next";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import api from "@/api/axiosInstance";
import QiraatDetailClient from "./QiraatDetailClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; qiraatId: string }>;
}): Promise<Metadata> {
  const { locale, qiraatId } = await params;
  const { t } = getLocalizedMetadata(locale);

  try {
    const response = await api.get("/qiraats");
    const qiraats = response.data?.data;
    const qiraat = qiraats?.find((q: any) => q.id.toString() === qiraatId);
    
    const qiraatName = qiraat ? (qiraat.name[locale] || qiraat.name.en || qiraat.name) : t("Qira'at");

    const title = `${qiraatName} - ${t("Our quran")}`;
    const description = t("Qiraat_Description", { defaultValue: "Read the differences and explanation for this Qira'at." });

    return {
      title,
      description,
      openGraph: { title, description, type: "website" },
      twitter: { card: "summary_large_image", title, description }
    };
  } catch (error) {
    const title = `${t("Qira'at")} - ${t("Our quran")}`;
    const description = t("Qiraat_Description", { defaultValue: "Read the differences and explanation for this Qira'at." });
    return {
      title,
      description,
      openGraph: { title, description, type: "website" },
      twitter: { card: "summary_large_image", title, description }
    };
  }
}

export default async function QiraatDetailPage({ params }: { params: Promise<{ qiraatId: string }> }) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<Loading />}>
      <QiraatDetailClient qiraatId={resolvedParams.qiraatId} />
    </Suspense>
  );
}
