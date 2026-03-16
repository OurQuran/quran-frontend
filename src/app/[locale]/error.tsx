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
      <h2 className="text-3xl font-bold mb-4">{t("Something went wrong!")}</h2>
      <p className="text-muted-foreground mb-8">
        {t("We apologize for the inconvenience. Please try again or contact support if the issue persists.")}
      </p>
      <Button onClick={() => reset()}>
        {t("Try again")}
      </Button>
    </div>
  );
}
