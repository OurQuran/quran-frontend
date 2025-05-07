import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation("global");
  return (
    <footer className="py-4 text-center text-sm text-gray-600">
      <div className="container mx-auto">
        <p>
          {t("Our quran")}
          <br /> © {new Date().getFullYear()}
          {t("All rights reserved")}
        </p>
      </div>
    </footer>
  );
}
