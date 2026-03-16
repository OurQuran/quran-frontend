import i18next, { createInstance, i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import global_en from "./en.json";
import global_ku from "./ku.json";
import global_ar from "./ar.json";

const resources = {
  en: { global: global_en },
  ku: { global: global_ku },
  ar: { global: global_ar },
};

// Isolated instance for SSR/Hydration
export const createI18nInstance = (locale: string): i18n => {
  const instance = createInstance();
  instance.use(initReactI18next).init({
    interpolation: { escapeValue: true },
    lng: locale,
    fallbackLng: "en",
    resources,
    defaultNS: "global",
  });
  return instance;
};

// For Client Components: Initialize the singleton once
export const initI18n = async (locale: string): Promise<i18n> => {
  if (!i18next.isInitialized) {
    await i18next.use(initReactI18next).init({
      interpolation: { escapeValue: true },
      lng: locale,
      fallbackLng: "en",
      resources,
      defaultNS: "global",
    });
  } else if (i18next.language !== locale) {
    await i18next.changeLanguage(locale);
  }
  return i18next;
};

export default i18next;
