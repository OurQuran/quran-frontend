import SignUpClient from "./SignUpClient";
import { getLocalizedMetadata } from "@/helpers/metadataHelper";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return {
    title: t("Sign Up - Our Quran"),
    description: t("Create a new account on Our Quran."),
  };
}

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Loading from "@/components/Loading";

export default async function SignUpPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SignUpClient />
    </Suspense>
  );
}
