import { Metadata } from "next";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import QiraatsClient from "./QiraatsClient";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  const title = `${t("Qira'ats")} - ${t("Our quran")}`;
  const description = t("Qiraats_Description", { defaultValue: "Explore the different Qira'ats and their readings." });

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default function QiraatsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <QiraatsClient />
    </Suspense>
  );
}
