import { RouterProvider } from "react-router";
import { useTranslation } from "react-i18next";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useEffect } from "react";
import { Toaster } from "./components/ui/sonner";
import router from "./router";

export default function App() {
  const { i18n } = useTranslation();
  const dir = i18n.language === "ar" || i18n.language === "ku" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = dir;
  }, [i18n.language, dir]);

  const fontClass = i18n.language === "en" ? "font-poppins" : "font-kurdish";

  return (
    <DirectionProvider dir={dir}>
      <RouterProvider router={router} />
      <Toaster toastOptions={{ className: fontClass }} dir={dir} />
    </DirectionProvider>
  );
}
