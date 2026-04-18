import { Metadata } from "next";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import BooksClient from "./BooksClient";
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

  const title = `${t("Books")} - ${t("Our quran")}`;
  const description = t("Books_Description", { defaultValue: "Library of Islamic books and resources." });

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description }
  };
}

export default function BooksPage() {
  return (
    <Suspense fallback={<Loading />}>
      <BooksClient />
    </Suspense>
  );
}
