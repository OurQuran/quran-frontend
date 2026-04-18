"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [t] = useTranslation("global");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-5 text-center">
      <h2 className="text-3xl font-bold mb-4">{t("Something Went Wrong")}</h2>
      <p className="text-muted-foreground mb-8">
        {t("Please try again later or refresh the page")}
      </p>
      <Button onClick={() => reset()}>
        {t("Try again")}
      </Button>
    </div>
  );
}
