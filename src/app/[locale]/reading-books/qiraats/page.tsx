import { Metadata, Viewport } from "next";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";
import QiraatsClient from "./QiraatsClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export function generateViewport(): Viewport {
  return generateViewportConfig();
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("Reading Books - Our Quran"),
    description: t("Explore various Quranic qira'ats and reading books."),
    path: "/reading-books/qiraats",
  });
}

export default function QiraatsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <QiraatsClient />
    </Suspense>
  );
}
