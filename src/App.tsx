import { RouterProvider } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import router from "./router";

export default function () {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
