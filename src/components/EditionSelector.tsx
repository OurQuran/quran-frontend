import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { IEdition, IFilter } from "@/types/generalTypes";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "@/helpers/utils";
import { setItem } from "@/helpers/localStorage";

export default function EditionSelector({
  filters,
  setFilters,
  accessor,
  editions,
}: {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  editions: IEdition[];
  accessor: keyof IFilter;
}) {
  const [open, setOpen] = useState(false);
  const [t] = useTranslation("global");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {filters[accessor]
            ? editions.find((edition) => edition.id === filters[accessor])?.name
            : t("Select Edition...")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        align="start"
        sideOffset={4}
        data-lenis-prevent
      >
        <Command>
          <CommandInput placeholder={t("Search Edition...")} className="h-9" />
          <CommandList>
            <ScrollArea className="h-[200px]">
              <CommandGroup>
                <CommandEmpty>{t("No Edition found.")}</CommandEmpty>
                {editions.map((edition) => (
                  <CommandItem
                    key={edition.id + "edition-item"}
                    value={edition.name}
                    dir={getTextDirection(edition.name)}
                    onSelect={() => {
                      setFilters({
                        ...filters,
                        [accessor]: edition.id,
                      });
                      setItem(accessor, edition.id.toString());
                      setOpen(false);
                    }}
                  >
                    {edition.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        filters[accessor] === edition.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
