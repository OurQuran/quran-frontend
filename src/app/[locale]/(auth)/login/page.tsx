import { Metadata, Viewport } from "next";
import LoginClient from "./LoginClient";
import {
  getLocalizedMetadata,
  generateCompleteMetadata,
  generateViewportConfig,
} from "@/helpers/metadataHelper";

import { Suspense } from "react";
import Loading from "@/components/Loading";

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
    title: t("Login - Our Quran"),
    description: t("Login_Description"),
    path: "/login",
  });
}

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginClient />
    </Suspense>
  );
}
