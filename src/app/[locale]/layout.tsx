import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { i18nConfig, Locale } from "@/i18n-config";
import MainLayout from "@/layout/MainLayout";
import Providers from "../providers";
import {
  arkanGraphik,
  quranFont1,
  quranFont2,
  quranFont3,
  quranFont4,
  quranFont5,
} from "@/lib/fonts";

import { Metadata, Viewport } from "next";
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
}) {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);

  return generateCompleteMetadata({
    locale,
    title: t("Our Quran - Read, Listen, and Search"),
    description: t(
      "A modern Quranic platform for reading, listening, and semantic search.",
    ),
  });
}

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!i18nConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`
          ${arkanGraphik.className}
          ${arkanGraphik.variable} 
          ${quranFont1.variable} 
          ${quranFont2.variable} 
          ${quranFont3.variable} 
          ${quranFont4.variable} 
          ${quranFont5.variable} 
          antialiased
        `}
      >
        <Providers locale={locale}>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
