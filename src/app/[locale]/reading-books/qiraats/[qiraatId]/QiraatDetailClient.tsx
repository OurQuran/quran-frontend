"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import useGet from "@/react-query/useGet";
import TableData from "@/components/TableData";
import { TablePagination } from "@/components/TablePagination";
import { IFilter, ISurahs } from "@/types/generalTypes";
import { ColumnDef } from "@tanstack/react-table";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
  notFound,
} from "next/navigation";
import Link from "next/link";
import { useQiraatStore } from "@/store/qiraatStore";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export interface IQiraatDifference {
  id: number;
  qiraat_reading_id: number;
  surah: number;
  ayah: number;
  hafs_text: string;
  qiraat_options: string;
  qiraat_text: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

export default function QiraatDetailClient({ qiraatId }: { qiraatId: string }) {
  const { t, i18n } = useTranslation("global");
  const router = useRouter();
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentLang = i18n.language as "ar" | "en" | "ku";
  const isRTL = locale === "ar" || locale === "ku";

  const { qiraats, fetchQiraats } = useQiraatStore();
  const { data: surahs } = useGet<ISurahs[], false>("surahs");

  useEffect(() => {
    if (qiraats.length === 0) {
      fetchQiraats();
    }
  }, [qiraats.length, fetchQiraats]);

  const [filter, setFilter] = useState<IFilter>({
    page: Number(searchParams.get("page")) || 1,
    per_page: Number(searchParams.get("per_page")) || 20,
    sort_by: searchParams.get("sort_by") || undefined,
    surah: searchParams.get("surah") || undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.surah) params.set("surah", filter.surah);
    if (filter.page && filter.page !== 1)
      params.set("page", filter.page.toString());
    if (filter.per_page && filter.per_page !== 20)
      params.set("per_page", filter.per_page.toString());
    if (filter.sort_by) params.set("sort_by", filter.sort_by);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [filter, pathname, router]);

  const { data, isLoading, isError, error } = useGet<IQiraatDifference, true>(
    `qiraats/${qiraatId}/differences`,
    filter,
  );

  useEffect(() => {
    if (isError && (error as any)?.response?.status === 404) {
      notFound();
    }
  }, [isError, error]);

  const qiraatOptions = useMemo(() => {
    return qiraats.map((q) => ({
      id: q.id,
      label: q.name[currentLang] || q.name.en,
    }));
  }, [qiraats, currentLang]);

  const surahOptions = useMemo(() => {
    return (surahs || []).map((s) => ({
      id: s.id,
      label: currentLang === "en" ? s.name_en : s.name_ar,
    }));
  }, [surahs, currentLang]);

  const columns: ColumnDef<IQiraatDifference>[] = [
    {
      accessorKey: "surah",
      header: t("Surah", { defaultValue: "Surah" }),
      cell: ({ row }) => {
        const surahId = row.original.surah;
        const surah = surahOptions.find((s) => s.id === surahId);
        return (
          <Link
            href={`/${locale}/surah/${surahId}`}
            className="whitespace-nowrap text-primary hover:underline hover:text-primary/80 transition-colors inline-block"
          >
            {surah ? surah.label : surahId}
          </Link>
        );
      },
    },
    {
      accessorKey: "hafs_text",
      header: t("Hafs Text", { defaultValue: "Hafs Text" }),
      cell: ({ row }) => (
        <div className="font-quran-4 text-xl rtl:text-right whitespace-nowrap max-w-[150px] lg:max-w-[250px] truncate">
          {row.original.hafs_text}
        </div>
      ),
    },
    {
      accessorKey: "qiraat_options",
      header: t("Qiraat Options", { defaultValue: "Qiraat Options" }),
      cell: ({ row }) => (
        <div className="font-quran-4 text-xl rtl:text-right whitespace-nowrap text-primary max-w-[150px] lg:max-w-[250px] truncate">
          {row.original.qiraat_options}
        </div>
      ),
    },
    {
      accessorKey: "qiraat_text",
      header: t("Qiraat Text", { defaultValue: "Qiraat Text" }),
      cell: ({ row }) => (
        <div className="font-quran-4 text-xl rtl:text-right whitespace-nowrap text-primary max-w-[150px] lg:max-w-[250px] truncate">
          {row.original.qiraat_text}
        </div>
      ),
    },
    {
      accessorKey: "explanation",
      header: t("Explanation", { defaultValue: "Explanation" }),
      cell: ({ row }) => (
        <div className="text-sm rtl:text-right w-full max-w-[300px] lg:max-w-[400px] truncate text-muted-foreground">
          {row.original.explanation}
        </div>
      ),
    },
  ];

  function SearchableSelect({
    value,
    onChange,
    options,
    placeholder,
    searchPlaceholder,
    emptyText,
    allowClear,
  }: {
    value: number | string | null;
    onChange: (val: number | null) => void;
    options: { id: number; label: string }[];
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    allowClear?: boolean;
  }) {
    const [open, setOpen] = useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {value
                ? options.find((o) => o.id === value)?.label || placeholder
                : placeholder}
            </span>
            <div className="flex items-center">
              {allowClear && value !== null && (
                <div
                  className="p-1 hover:bg-muted-foreground/20 rounded-sm cursor-pointer mr-1 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          sideOffset={4}
          data-lenis-prevent
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
            <CommandList>
              <ScrollArea className="h-[200px]">
                <CommandGroup>
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.label}
                      onSelect={() => {
                        if (allowClear && value === option.id) {
                          onChange(null);
                        } else {
                          onChange(option.id);
                        }
                        setOpen(false);
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.id ? "opacity-100" : "opacity-0",
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {t("Qira'at Differences", { defaultValue: "Qira'at Differences" })}
        </h1>
      </div>

      <Card className="w-full mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("Qira'at", { defaultValue: "Qira'at" })}
              </label>
              <SearchableSelect
                value={Number(qiraatId)}
                onChange={(val) => {
                  if (val) {
                    router.push(`/${locale}/reading-books/qiraats/${val}`);
                  }
                }}
                options={qiraatOptions}
                placeholder={t("Select a Qira'at", {
                  defaultValue: "Select a Qira'at",
                })}
                searchPlaceholder={t("Search Qira'ats...", {
                  defaultValue: "Search Qira'ats...",
                })}
                emptyText={t("No Qira'ats found", {
                  defaultValue: "No Qira'ats found",
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("Surah", { defaultValue: "Surah" })}
              </label>
              <SearchableSelect
                value={filter.surah ? Number(filter.surah) : null}
                onChange={(val) => {
                  setFilter((prev) => ({
                    ...prev,
                    surah: val?.toString(),
                    page: 1,
                  }));
                }}
                options={surahOptions}
                placeholder={t("All Surahs", { defaultValue: "All Surahs" })}
                searchPlaceholder={t("Search Surahs...", {
                  defaultValue: "Search Surahs...",
                })}
                emptyText={t("No Surahs found", {
                  defaultValue: "No Surahs found",
                })}
                allowClear
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card border border-border/40 rounded-lg p-4 shadow-sm overflow-hidden">
        <ScrollArea orientation="horizontal" className="w-full">
          <TableData
            columns={columns}
            data={data?.result || []}
            isLoading={isLoading}
            sortBy={filter.sort_by || null}
            setSortBy={setFilter}
            renderRowDetails={(diff) => (
              <div
                className="p-4 md:p-8 bg-muted/20 border-t border-primary/10 space-y-8"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hafs Text */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
                      {t("Hafs Text", { defaultValue: "Hafs Text" })}
                    </h4>
                    <div className="bg-background/50 p-6 rounded-xl border border-border/50 flex items-center justify-center text-center shadow-sm">
                      <span className="font-quran-4 text-3xl leading-[2] md:text-4xl md:leading-[2.2]">
                        {diff.hafs_text}
                      </span>
                    </div>
                  </div>

                  {/* Qiraat Text */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-widest px-1">
                      {t("Qiraat Text", { defaultValue: "Qiraat Text" })}
                    </h4>
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 flex flex-col items-center justify-center text-center shadow-sm space-y-2">
                      <span className="font-quran-4 text-3xl leading-[2] md:text-4xl md:leading-[2.2] text-primary">
                        {diff.qiraat_text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Qiraat Options if any */}
                {diff.qiraat_options && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
                      {t("Qiraat Options", { defaultValue: "Qiraat Options" })}
                    </h4>
                    <div className="bg-secondary/10 p-6 rounded-xl border border-secondary/20 flex items-center justify-center text-center">
                      <span className="font-quran-4 text-2xl leading-[2] md:text-3xl md:leading-[2.2] text-secondary-foreground">
                        {diff.qiraat_options}
                      </span>
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-1">
                    {t("Explanation", { defaultValue: "Explanation" })}
                  </h4>
                  <div className="bg-background border rounded-xl p-6 shadow-sm">
                    <p className="text-base md:text-lg leading-loose text-foreground whitespace-pre-wrap">
                      {diff.explanation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end text-[10px] text-muted-foreground gap-4 px-2">
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded">
                    <span className="font-bold">
                      {t("ID", { defaultValue: "ID" })}:
                    </span>{" "}
                    {diff.id}
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2 py-1 rounded">
                    <span className="font-bold">
                      {t("Ayah", { defaultValue: "Ayah" })}:
                    </span>{" "}
                    {diff.ayah}
                  </div>
                </div>
              </div>
            )}
          />
        </ScrollArea>

        {data?.meta && data.meta.total_pages > 1 && (
          <div className="mt-4 pt-4 border-t border-border/40">
            <TablePagination
              currentPage={data.meta.current_page}
              totalPages={data.meta.total_pages}
              pageSize={data.meta.page_size}
              onPageChange={(page) => setFilter((p) => ({ ...p, page }))}
              onPageSizeChange={(per_page) =>
                setFilter((p) => ({ ...p, per_page, page: 1 }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
