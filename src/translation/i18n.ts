import i18next, { createInstance, i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./i18n.server";

// Isolated instance for Client Components (With React integration)
export const createClientI18nInstance = (locale: string): i18n => {
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

// For Client Components: Initialize the singleton with React integration
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
