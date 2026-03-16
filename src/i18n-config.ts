export const i18nConfig = {
  defaultLocale: "en",
  locales: ["en", "ar", "ku"],
} as const;

export type Locale = (typeof i18nConfig)["locales"][number];
