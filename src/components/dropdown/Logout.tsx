import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { onError } from "@/helpers/utils";
import AppDialog from "../AppDialog";
import useAdd from "@/react-query/useAdd";
import { destroyToken } from "@/helpers/localStorage";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";

export default function Logout({
  children,
  isOpen,
  setIsOpen,
}: {
  children?: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const [t] = useTranslation("global");
  const navigate = useNavigate();
  const authStore = useAuthStore();

  function onMutationSuccess() {
    destroyToken();
    authStore.reset();
    navigate("/login");
  }
  function onMutationError() {
    onError(t("Something went wrong"));
  }

  const logoutMutation = useAdd("logout", onMutationSuccess, onMutationError);

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("Logout")}
      description={t("Are you sure you want to logout?")}
      trigger={children}
      footer={
        <>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t("Cancel")}
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              logoutMutation.mutate({});
            }}
          >
            {t("Yes")}
          </Button>
        </>
      }
    />
  );
}
