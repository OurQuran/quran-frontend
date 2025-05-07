import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IFilter } from "@/types/generalTypes";
import { useTranslation } from "react-i18next";
import AppTooltip from "./AppTooltip";
import { useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface SearchWithFiltersProps {
  filters: IFilter;
  setFilters: (filters: IFilter) => void;
}

export default function SearchWithFilters({
  filters,
  setFilters,
}: SearchWithFiltersProps) {
  const [t] = useTranslation("global");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const handleRevelationTypeChange = (value: string) => {
    setFilters({ ...filters, type: value });
  };

  const handleSortOrderChange = (value: string) => {
    setFilters({ ...filters, revelation_order: value });
  };

  useHotkeys("ctrl+k, meta+k", (event) => {
    event.preventDefault();
    searchInputRef.current?.focus();
  });

  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 text-primary -translate-y-1/2 " />
            <Input
              className="p-5 pl-10 bg-muted"
              placeholder={t("Ctrl+K to focus")}
              value={filters.name}
              ref={searchInputRef}
              onChange={handleQueryChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 justify-between">
            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("Revelation Type")}
              </span>
              <div className="flex bg-muted p-1 gap-1 rounded-lg">
                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleRevelationTypeChange("")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        !filters.type
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Both")}
                    </button>
                  }
                  content={
                    <div>{t("Show both Meccan and Medinan revelations")}</div>
                  }
                />

                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleRevelationTypeChange("Meccan")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        filters.type === "Meccan"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Meccan")}
                    </button>
                  }
                  content={<div>{t("Revelations received in Mecca")}</div>}
                />

                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleRevelationTypeChange("Medinan")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        filters.type === "Medinan"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Medinan")}
                    </button>
                  }
                  content={<div>{t("Revelations received in Medina")}</div>}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("Revelation Order")}
              </span>
              <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleSortOrderChange("")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        !filters.revelation_order
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("None")}
                    </button>
                  }
                  content={<div>{t("Normal Quranic Order")}</div>}
                />
                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleSortOrderChange("asc")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        filters.revelation_order === "asc"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Ascending")}
                    </button>
                  }
                  content={<div>{t("Sort in ascending order")}</div>}
                />

                <AppTooltip
                  trigger={
                    <button
                      onClick={() => handleSortOrderChange("desc")}
                      className={cn(
                        "px-4 py-1.5 text-sm rounded-md cursor-pointer transition-all duration-200",
                        filters.revelation_order === "desc"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t("Descending")}
                    </button>
                  }
                  content={<div>{t("Sort in descending order")}</div>}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
