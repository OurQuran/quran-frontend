import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { toast } from "sonner";
import { CircleX, CopyCheck } from "lucide-react";

export default function CopyLink({ id }: { id: number }) {
  const [t] = useTranslation("global");

  function copyLink() {
    const linkToCopy = import.meta.env.VITE_CLIENT_LINK + "/form/" + id;

    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        toast(t("copied"), {
          icon: <CopyCheck className="text-orange-500" />,
          description: t("formLinkCopiedSuccessfully"),
        });
      })
      .catch(() => {
        toast(t("copyError"), {
          icon: <CircleX className="text-red-500" />,
          description: t("formLinkCopyError"),
        });
      });
  }

  return (
    <DropdownMenuItem>
      <div onClick={copyLink} className="w-full cursor-pointer">
        {t("copyFormLink")}
      </div>
    </DropdownMenuItem>
  );
}
