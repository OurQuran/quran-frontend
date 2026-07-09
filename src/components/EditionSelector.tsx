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
import { IEdition, IFilter, IQiraat, ITranslation } from "@/types/generalTypes";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "@/helpers/utils";
import { setItem } from "@/helpers/localStorage";
import { isTajweedEdition } from "@/helpers/tajweed";

type SelectorItem = IEdition | IQiraat;

function isTranslation(obj: any): obj is ITranslation {
  return (
    obj &&
    typeof obj === "object" &&
    ("ar" in obj || "en" in obj || "ku" in obj)
  );
}

function getLabel(item: SelectorItem, language: string): string {
  if (isTranslation(item.name)) {
    return item.name[language as keyof ITranslation] || item.name.en;
  }
  return item.name as string;
}

export default function EditionSelector({
  filters,
  setFilters,
  accessor,
  editions,
}: {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
  editions: SelectorItem[];
  accessor: keyof IFilter;
}) {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation("global");
  const currentLang = i18n.language;

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
            ? (() => {
                const found = editions.find((e) => e.id === filters[accessor]);
                return found
                  ? getLabel(found, currentLang)
                  : t("Select Edition");
              })()
            : t("Select Edition")}
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
          <CommandInput placeholder={t("Search Edition")} className="h-9" />
          <CommandList>
            <ScrollArea className="h-[200px]">
              <CommandGroup>
                <CommandEmpty>{t("No Edition found")}</CommandEmpty>
                {editions.map((edition) => {
                  const label = getLabel(edition, currentLang);
                  return (
                    <CommandItem
                      key={edition.id + "edition-item" + accessor}
                      value={label}
                      dir={getTextDirection(label)}
                      onSelect={() => {
                        setFilters({
                          ...filters,
                          [accessor]: edition.id,
                        });
                        setItem(accessor, edition.id.toString());
                        if (
                          accessor === "text_edition" &&
                          "identifier" in edition &&
                          !isTajweedEdition(edition)
                        ) {
                          setItem(
                            "preferred_translation_edition",
                            edition.id.toString(),
                          );
                        }
                        setOpen(false);
                      }}
                    >
                      {label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          filters[accessor] === edition.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
