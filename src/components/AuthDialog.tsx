"use client";

import { useTranslation } from "react-i18next";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import AppDialog from "./AppDialog";
import { Button } from "./ui/button";

export default function AuthDialog() {
  const { t } = useTranslation("global");
  const { isAuthModalOpen, setAuthModalOpen } = useAuthStore();
  const router = useRouter();
  const { locale } = useParams();

  const handleLogin = () => {
    setAuthModalOpen(false);
    router.push(`/${locale}/login`);
  };

  return (
    <AppDialog
      open={isAuthModalOpen}
      onOpenChange={setAuthModalOpen}
      title={t("auth_dialog_title", { defaultValue: "Login Required" })}
      description={t("auth_dialog_description", {
        defaultValue: "You are not logged in. You need to log in to do that action.",
      })}
      className="max-w-[400px]"
    >
      <div className="flex justify-end gap-3 mt-4">
        <Button
          variant="outline"
          onClick={() => setAuthModalOpen(false)}
        >
          {t("Cancel", { defaultValue: "Cancel" })}
        </Button>
        <Button onClick={handleLogin}>
          {t("Log In", { defaultValue: "Log In" })}
        </Button>
      </div>
    </AppDialog>
  );
}
