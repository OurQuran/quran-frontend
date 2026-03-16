import { createI18nInstance } from "./i18n";
import { cache } from "react";

// Per-request cache for server-side usage (Server Components)
export const getServerI18n = cache(async (locale: string) => {
  return createI18nInstance(locale);
});
