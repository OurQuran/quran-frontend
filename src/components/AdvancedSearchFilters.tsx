import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IFilter } from "@/types/generalTypes";
import { useTranslation } from "react-i18next";
import AppTooltip from "./AppTooltip";
import { useEffect, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { debounce } from "lodash";

interface SearchWithFiltersProps {
  filters: IFilter;
  setFilters: React.Dispatch<React.SetStateAction<IFilter>>;
}

export default function AdvancedSearchFilters({
  filters,
  setFilters,
}: SearchWithFiltersProps) {
  const [t] = useTranslation("global");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setFilters((prev: IFilter) => ({ ...prev, q: value, page: 1 }));
      }, 300),
    [setFilters]
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetQuery(e.target.value);
  };

  const handleTypeChange = (value: string) => {
    setFilters((prev: IFilter) => ({ ...prev, type: value }));
  };

  useHotkeys("ctrl+k, meta+k", (event) => {
    event.preventDefault();
    searchInputRef.current?.focus();
  });

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 text-primary -translate-y-1/2 " />
            <Input
              className="p-5 pl-10 bg-muted"
              placeholder={t("Ctrl+K to focus")}
              defaultValue={filters.q}
              ref={searchInputRef}
              onChange={handleQueryChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 justify-between">
            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("Search Type")}
              </span>
              <div className="flex bg-muted p-1 gap-1 rounded-lg">
                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleTypeChange("semantic")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        filters.type === "semantic"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Semantic")}
                    </button>
                  }
                  content={<div>{t("Set the saerch type to semantic")}</div>}
                />

                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleTypeChange("exact")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        filters.type === "exact"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Exact")}
                    </button>
                  }
                  content={<div>{t("Set the search type to exact")}</div>}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
