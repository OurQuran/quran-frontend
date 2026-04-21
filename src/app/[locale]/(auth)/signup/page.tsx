import { Metadata, Viewport } from "next";
import SignUpClient from "./SignUpClient";
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
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("Sign Up - Our Quran"),
    description: t("SignUp_Description"),
    path: "/signup",
  });
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
