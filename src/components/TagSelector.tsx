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
import { useEffect, useRef, useState } from "react";
import { ITag } from "@/types/generalTypes";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "@/helpers/utils";
import { setItem } from "@/helpers/localStorage";
import debounce from "lodash/debounce";

export default function TagSelector({
  tag,
  setTag,
  tags,
  onScrollEnd,
  search,
  setSearch,
}: {
  tag?: number;
  setTag: (tag: number) => void;
  tags: ITag[];
  onScrollEnd?: () => void;
  search: string;
  setSearch: (search: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [t] = useTranslation("global");
  const scrollRef = useRef<HTMLDivElement>(null);
  const SCROLL_THRESHOLD = 10;

  useEffect(() => {
    if (!open || !onScrollEnd) return;

    let cleanup = () => {};

    const frameId = requestAnimationFrame(() => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;

      const handleScroll = debounce(() => {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
          onScrollEnd();
        }
      }, 200);

      scrollEl.addEventListener("scroll", handleScroll);

      cleanup = () => {
        scrollEl.removeEventListener("scroll", handleScroll);
        handleScroll.cancel();
      };
    });

    return () => {
      cancelAnimationFrame(frameId);
      cleanup();
    };
  }, [open, onScrollEnd]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between hover:bg-transparent text-sm font-normal",
            !tag && "text-muted-foreground hover:text-muted-foreground"
          )}
        >
          {tag
            ? tags.find((item) => item.id === tag)?.name
            : t("Select Tag...")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 z-[51] "
        style={{
          width: "var(--radix-popover-trigger-width)",
        }}
        align="start"
        sideOffset={4}
        usePortal={false}
      >
        <Command>
          <CommandInput
            value={search}
            onValueChange={(e) => {
              setSearch(e);
            }}
            placeholder={t("Search Tag...")}
            className="h-9"
          />
          <CommandList>
            <ScrollArea
              ref={scrollRef}
              className="h-[100px] pointer-events-auto"
            >
              <CommandGroup>
                <CommandEmpty>{t("No Tag found.")}</CommandEmpty>
                {tags.map((tagItem) => (
                  <CommandItem
                    key={tagItem.id + "tag-item"}
                    value={tagItem.name}
                    dir={getTextDirection(tagItem.name)}
                    onSelect={() => {
                      setTag(tagItem.id);
                      setItem("tag", tagItem.id.toString());
                      setOpen(false);
                    }}
                  >
                    {tagItem.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        tag === tagItem.id ? "opacity-100" : "opacity-0"
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
