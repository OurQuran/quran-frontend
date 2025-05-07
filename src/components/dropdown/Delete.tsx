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
import useDelete from "@/react-query/useDelete";
import { onError, onSuccess } from "@/helpers/utils";

export default function Delete({ id, path }: { id: number; path: string }) {
  const [t] = useTranslation("global");
  const [isOpen, setIsOpen] = useState(false);

  function onDeleteSuccess() {
    setIsOpen(false);
    onSuccess(t("Record deleted successfully"));
  }
  function onDeleteError() {
    onError(t("Something went wrong"));
  }

  const handleDeleteClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const deleteMutation = useDelete(path, onDeleteSuccess, onDeleteError);

  const handleConfirmDelete = () => {
    deleteMutation.mutate(id + "");
  };
  {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={handleDeleteClick} variant="destructive">
            {t("Delete")}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-red-600">
              {t("Delete Record")}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {t("Are you sure you want to delete this record?")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              {t("Yes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
