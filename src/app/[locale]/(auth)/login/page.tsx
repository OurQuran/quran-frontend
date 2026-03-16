import LoginClient from "./LoginClient";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return {
    title: t("Login - Our Quran"),
    description: t("Login to your Our Quran account."),
  };
}

export const dynamic = "force-dynamic";


import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginClient />
    </Suspense>
  );
}
