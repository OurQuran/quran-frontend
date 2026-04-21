import type { Metadata, Viewport } from "next";
import { i18nConfig } from "@/i18n-config";
import { createI18nInstance } from "@/translation/i18n.server";

export const SITE_CONFIG = {
  name: "Our Quran",
  url: "https://ourquran.org",
  ogImage: "/web-icon/og-image.png",
};

/**
 * Ensures URLs are consistently formatted across the app.
 */
export function getAbsoluteUrl(path: string = "", locale?: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const localePrefix = locale ? `/${locale}` : "";
  return `${SITE_CONFIG.url}${localePrefix}${cleanPath}`;
}

/**
 * Safely extracts a localized string from a translation object or Record.
 */
export function getLocalizedString(
  data: any,
  locale: string,
  fallbackKey: string = "en",
): string {
  if (!data) return "";
  if (typeof data === "string") return data;
  return data[locale] || data[fallbackKey] || "";
}

export function getLocalizedMetadata(locale: string) {
  const i18n = createI18nInstance(locale);
  const t = (key: string, variables?: Record<string, any>) => {
    return i18n.t(key, { ...variables, ns: "global" });
  };

  return { t };
}

/**
 * Standard Viewport configuration for the entire site.
 * Next.js 14+ requires this to be exported separately.
 */
export function generateViewportConfig(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
  };
}

export function generateCompleteMetadata({
  locale,
  title,
  description,
  path = "",
  type = "website",
  image = SITE_CONFIG.ogImage,
  keywords,
}: {
  locale: string;
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article" | "book";
  image?: string;
  keywords?: string;
}): Metadata {
  const url = getAbsoluteUrl(path, locale);

  const languages = i18nConfig.locales.reduce(
    (acc, loc) => {
      acc[loc] = getAbsoluteUrl(path, loc);
      return acc;
    },
    {} as Record<string, string>,
  );

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title,
    description,
    keywords,
    robots: "index, follow",
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image.startsWith("http") ? image : getAbsoluteUrl(image),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === "ar" ? "ar_SA" : locale === "ku" ? "ckb_IQ" : "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : getAbsoluteUrl(image)],
    },
  };
}

export function generateBookSchema(
  book: { name: string; id: number },
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.name,
    url: getAbsoluteUrl(`/reading-books/books/${book.id}`, locale),
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
  };
}

export function generateSurahSchema(
  surah: { name: string; id: number },
  locale: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: surah.name,
    url: getAbsoluteUrl(`/surah/${surah.id}`, locale),
    inLanguage: locale,
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : getAbsoluteUrl(item.url),
    })),
  };
}
