import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateViewportConfig,
  generateCompleteMetadata,
} from "@/helpers/metadataHelper";
import api from "@/api/axiosInstance";
import QiraatDetailClient from "./QiraatDetailClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import { notFound } from "next/navigation";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; qiraatId: string }>;
}): Promise<Metadata> {
  const { locale, qiraatId } = await params;
  const { t } = getLocalizedMetadata(locale);

  if (isNaN(parseInt(qiraatId))) {
    return { title: t("Page Not Found") };
  }

  try {
    const response = await api.get("/qiraats");
    const qiraats = response.data?.data;
    const qiraat = qiraats?.find((q: any) => q.id.toString() === qiraatId);

    const qiraatName = qiraat
      ? qiraat.name[locale] || qiraat.name.en || qiraat.name
      : t("Qira'at");

    const title = t("Meta_Qiraat_Title", { name: qiraatName });
    const description = t("Meta_Qiraat_Description");

    return generateCompleteMetadata({
      locale,
      title,
      description,
      path: `/reading-books/qiraats/${qiraatId}`,
    });
  } catch (error) {
    const title = t("Meta_Qiraat_Title", { name: t("Qira'at") });
    const description = t("Meta_Qiraat_Description");
    return generateCompleteMetadata({
      locale,
      title,
      description,
      path: `/reading-books/qiraats/${qiraatId}`,
    });
  }
}

export default async function QiraatDetailPage({
  params,
}: {
  params: Promise<{ qiraatId: string }>;
}) {
  const resolvedParams = await params;

  if (isNaN(parseInt(resolvedParams.qiraatId))) {
    notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <QiraatDetailClient qiraatId={resolvedParams.qiraatId} />
    </Suspense>
  );
}
