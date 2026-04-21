import { createInstance, i18n } from "i18next";
import { cache } from "react";
import global_en from "./en.json";
import global_ku from "./ku.json";
import global_ar from "./ar.json";

export const resources = {
  en: { global: global_en },
  ku: { global: global_ku },
  ar: { global: global_ar },
};

/**
 * Isolated instance for Server Components / Metadata (No React dependencies)
 * This avoids 'createContext' errors in Next.js Server Components.
 * Wrapped in React.cache to share the same instance across the request lifecycle.
 */
export const createI18nInstance = cache((locale: string): i18n => {
  const instance = createInstance();
  instance.init({
    interpolation: { escapeValue: true },
    lng: locale,
    fallbackLng: "en",
    resources,
    defaultNS: "global",
  });
  return instance;
});
