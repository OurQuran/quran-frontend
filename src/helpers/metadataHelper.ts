import global_en from "@/translation/en.json";
import global_ar from "@/translation/ar.json";
import global_ku from "@/translation/ku.json";

export function getLocalizedMetadata(locale: string) {
  const translations: Record<string, any> = {
    en: global_en,
    ar: global_ar,
    ku: global_ku,
  };

  const localizedStrings = translations[locale] || global_en;

  const t = (key: string, variables?: Record<string, any>) => {
    let text = localizedStrings[key] || global_en[key as keyof typeof global_en] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  };

  return { t };
}
