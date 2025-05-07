import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import global_en from "./translation/en.json";
import global_ku from "./translation/ku.json";
import global_ar from "./translation/ar.json";

import { getLang } from "./helpers/localStorage";
import { Toaster } from "./components/ui/sonner";
import App from "./App";
import "@/index.css";
import { TooltipProvider } from "./components/ui/tooltip";

i18next.init({
  interpolation: { escapeValue: true },
  lng: getLang() || "en",
  resources: {
    en: { global: global_en },
    ku: { global: global_ku },
    ar: { global: global_ar },
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <I18nextProvider i18n={i18next}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  </I18nextProvider>
);
