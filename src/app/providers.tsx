"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { I18nextProvider } from "react-i18next";
import { DirectionProvider } from "@radix-ui/react-direction";
import i18next, { createI18nInstance, initI18n } from "@/translation/i18n";

export default function Providers({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const [queryClient] = useState(() => new QueryClient());
  
  // Create a stable isolated instance for this request/render tree
  const [i18nInstance] = useState(() => createI18nInstance(locale));

  // Sync global i18next instance on client mount for legacy code
  useEffect(() => {
    initI18n(locale);
  }, [locale]);

  const dir = locale === "ar" || locale === "ku" ? "rtl" : "ltr";
  const fontClass = locale === "en" ? "font-poppins" : "font-kurdish";

  // Sync attributes to body for Portals (Dialogs, Sheets, etc.)
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dir = dir;
      document.body.classList.remove("font-poppins", "font-kurdish");
      document.body.classList.add(fontClass);
    }
  }, [dir, fontClass]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <I18nextProvider i18n={i18nInstance}>
          <DirectionProvider dir={dir}>
            <div dir={dir} className={fontClass}>
              {children}
              <Toaster toastOptions={{ className: fontClass }} dir={dir} />
            </div>
          </DirectionProvider>
        </I18nextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
