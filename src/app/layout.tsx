import type { Metadata } from "next";
import {
  arkanGraphik,
  quranFont1,
  quranFont2,
  quranFont3,
  quranFont4,
  quranFont5,
} from "@/lib/fonts";
import "@/index.css";

export const metadata: Metadata = {
  title: "OurQuran",
  description: "A comprehensive Quran application",
  icons: {
    icon: [
      { url: "/web-icon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/web-icon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/web-icon/favicon.ico", sizes: "any" },
    ],
    apple: [
      {
        url: "/web-icon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/web-icon/site.webmanifest",
};

import { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
