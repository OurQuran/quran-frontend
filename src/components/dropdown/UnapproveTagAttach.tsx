import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { onError, onSuccess } from "@/helpers/utils";
import useAdd from "@/react-query/useAdd";

export default function UnapproveTagAttach({ id }: { id: number }) {
  const [t] = useTranslation("global");
  const [isOpen, setIsOpen] = useState(false);

  function onUnapproveSuccess() {
    setIsOpen(false);
    onSuccess(t("Tag Unapproved successfully"));
  }
  function onUnapproveError() {
    onError(t("Something went wrong"));
  }

  const handleClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const unapproveMutation = useAdd(
    "tags/unapprove",
    onUnapproveSuccess,
    onUnapproveError
  );

  const handleSubmit = () => {
    unapproveMutation.mutate({ id });
  };
  {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            onSelect={handleClick}
            className="cursor-pointer text-red-600 hover:!text-white hover:!bg-red-600"
          >
            {t("Unapprove")}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {t("Unapprove Tag")}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {t("Are you sure you want to unapprove this tag?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleSubmit}
            >
              {t("Yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
