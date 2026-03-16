import { ReactNode } from "react";
import { i18nConfig } from "@/i18n-config";
import MainLayout from "@/layout/MainLayout";
import Providers from "../providers";

import { getLocalizedMetadata } from "@/helpers/metadataHelper";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { t } = getLocalizedMetadata(locale);
  const title = t("Our Quran - Read, Listen, and Search");
  const description = t("A modern Quranic platform for reading, listening, and semantic search.");
  const url = `https://ourquran.com/${locale}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Our Quran",
      images: [
        {
          url: "/web-icon/og-image.png",
          width: 1200,
          height: 630,
          alt: "Our Quran",
        },
      ],
      locale: locale === "ar" ? "ar_SA" : locale === "ku" ? "ckb_IQ" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/web-icon/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        en: "https://ourquran.com/en",
        ar: "https://ourquran.com/ar",
        ku: "https://ourquran.com/ku",
      },
    },
  };
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
  
  return (
    <Providers locale={locale}>
      <MainLayout>{children}</MainLayout>
    </Providers>
  );
}
