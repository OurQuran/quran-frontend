"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useEditionStore } from "@/store/editionStore";
import { useQiraatStore } from "@/store/qiraatStore";
import { useMushafPage } from "@/hooks/useMushafPage";
import { getItem, setItem } from "@/helpers/localStorage";
import { IFilter } from "@/types/generalTypes";
import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import EditionSelector from "@/components/EditionSelector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  Minus,
  Settings2,
  Info,
  ArrowRight,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import AppTooltip from "./AppTooltip";
import useGet from "@/react-query/useGet";
import { IAayh, ISurahs } from "@/types/generalTypes";
import { Fragment } from "react";
import AyahCard from "@/components/AyahCard";
import AppDialog from "@/components/AppDialog";
import { cn } from "@/lib/utils";
import TajweedLegend from "@/components/TajweedLegend";
import {
  canRenderTajweedForQiraat,
  findTajweedEdition,
  isTajweedEdition,
  renderTajweedText,
  TAJWEED_DEFAULT_QIRAAT_ID,
} from "@/helpers/tajweed";

function MushafBorder() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 text-primary">
      {/* Delicate Primary Border SVG */}
      <svg
        className="w-full h-full opacity-80"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          rx="1"
        />
        <rect
          x="4"
          y="4"
          width="92"
          height="92"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.2"
          rx="0.5"
        />
        <path
          d="M0,10 L0,0 L10,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform="translate(2,2)"
        />
        <path
          d="M0,10 L0,0 L10,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform="translate(98,2) rotate(90)"
        />
        <path
          d="M0,10 L0,0 L10,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform="translate(98,98) rotate(180)"
        />
        <path
          d="M0,10 L0,0 L10,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          transform="translate(2,98) rotate(270)"
        />
      </svg>
    </div>
  );
}

export default function MushafPageClient({
  pageNumber,
}: {
  pageNumber: string;
}) {
  const { t, i18n } = useTranslation("global");
  const router = useRouter();
  const { locale } = useParams();
  const [selectedAyah, setSelectedAyah] = useState<IAayh | null>(null);

  const { audioEditions, textEditions, fetchEditions } = useEditionStore();
  const { qiraats, fetchQiraats } = useQiraatStore();

  const [filters, setFilters] = useState<IFilter>({
    audio_edition: 0,
    text_edition: 0,
    qiraat_reading_id: 0,
  });
  const [fontSize, setFontSize] = useState(36);
  const [jumpPage, setJumpPage] = useState("");
  const [showQiraatDiffs, setShowQiraatDiffs] = useState(true);
  const [showTajweed, setShowTajweed] = useState(false);
  const [showTajweedLegend, setShowTajweedLegend] = useState(true);
  const clickTimeoutRef =
    typeof window !== "undefined"
      ? { current: null as any }
      : { current: null };
  const longPressTimeoutRef =
    typeof window !== "undefined"
      ? { current: null as any }
      : { current: null };

  const pageInt = parseInt(pageNumber);

  useEffect(() => {
    const savedAudio = getItem("audio_edition");
    const savedText = getItem("text_edition");
    const savedQiraat = getItem("qiraat_reading_id");
    const savedFontSize = getItem("mushaf_font_size");
    const savedShowQiraatDiffs = getItem("show_qiraat_diffs");
    const savedShowTajweed = getItem("show_tajweed");
    const savedShowTajweedLegend = getItem("show_tajweed_legend");

    setFilters((prev) => ({
      ...prev,
      audio_edition: savedAudio ? parseInt(savedAudio) : prev.audio_edition,
      text_edition: savedText ? parseInt(savedText) : prev.text_edition,
      qiraat_reading_id: savedQiraat
        ? parseInt(savedQiraat)
        : prev.qiraat_reading_id,
    }));

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
    } else {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      setFontSize(isMobile ? 28 : 36);
    }

    if (savedShowQiraatDiffs === false) {
      setShowQiraatDiffs(false);
    }

    if (savedShowTajweed === true || savedShowTajweed === "true") {
      setShowTajweed(true);
    }

    if (savedShowTajweedLegend === false || savedShowTajweedLegend === "false") {
      setShowTajweedLegend(false);
    }

    fetchEditions();
    fetchQiraats();
  }, [fetchEditions, fetchQiraats]);

  const handleFontSizeChange = (updater: (prev: number) => number) => {
    setFontSize((prev) => {
      const newSize = updater(prev);
      setItem("mushaf_font_size", newSize.toString());
      return newSize;
    });
  };

  const handleShowQiraatDiffsChange = (checked: boolean) => {
    setShowQiraatDiffs(checked);
    setItem("show_qiraat_diffs", checked);
  };

  const handleShowTajweedChange = (checked: boolean) => {
    setShowTajweed(checked);
    setItem("show_tajweed", checked);

    if (checked) {
      setFilters((prev) => ({
        ...prev,
        qiraat_reading_id: TAJWEED_DEFAULT_QIRAAT_ID,
      }));
      setItem("qiraat_reading_id", TAJWEED_DEFAULT_QIRAAT_ID.toString());
    }
  };

  const handleShowTajweedLegendChange = () => {
    setShowTajweedLegend((prev) => {
      const next = !prev;
      setItem("show_tajweed_legend", next);
      return next;
    });
  };

  const { data, isLoading, isError } = useMushafPage(pageNumber, filters);
  const { data: allSurahs } = useGet<ISurahs[]>("surahs");

  const handleNextPage = () => {
    if (pageInt < 604) {
      router.push(`/${locale}/surahs/page/${pageInt + 1}`);
    }
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage);
    if (!isNaN(p) && p >= 1 && p <= 604) {
      router.push(`/${locale}/surahs/page/${p}`);
      setJumpPage("");
    } else {
      toast.error(t("Invalid page number (1-604)"));
    }
  };

  const handlePrevPage = () => {
    if (pageInt > 1) {
      router.push(`/${locale}/surahs/page/${pageInt - 1}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) return;

      const isRTL = locale === "ar" || locale === "ku";

      if (e.key === "ArrowLeft") {
        if (isRTL)
          handleNextPage(); // In RTL, Left is Next (Page N+1)
        else handlePrevPage(); // In LTR, Left is Previous (Page N-1)
      } else if (e.key === "ArrowRight") {
        if (isRTL)
          handlePrevPage(); // In RTL, Right is Previous (Page N-1)
        else handleNextPage(); // In LTR, Right is Next (Page N+1)
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [locale, pageInt, handleNextPage, handlePrevPage]);

  const ayahs = data?.ayahs || [];
  const meta = ayahs[0] || {};
  const selectableTextEditions = textEditions.filter(
    (edition) => !isTajweedEdition(edition),
  );
  const tajweedEdition = findTajweedEdition(textEditions);
  const canRenderTajweed = canRenderTajweedForQiraat(
    tajweedEdition,
    filters.qiraat_reading_id,
  );
  const tajweedQuery = useMushafPage(
    pageNumber,
    {
      ...filters,
      text_edition: tajweedEdition?.id ?? 0,
    },
    {
      enabled: showTajweed && !!tajweedEdition?.id,
      queryKeyPrefix: "mushaf-tajweed",
    },
  );
  const tajweedByAyahId = new Map(
    (tajweedQuery.data?.ayahs || []).map((ayah) => [ayah.id, ayah.translation]),
  );

  useEffect(() => {
    if (!showTajweed || filters.qiraat_reading_id === TAJWEED_DEFAULT_QIRAAT_ID) {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      qiraat_reading_id: TAJWEED_DEFAULT_QIRAAT_ID,
    }));
    setItem("qiraat_reading_id", TAJWEED_DEFAULT_QIRAAT_ID.toString());
  }, [filters.qiraat_reading_id, showTajweed]);

  useEffect(() => {
    if (audioEditions.length || textEditions.length || qiraats.length) {
      setFilters((prev) => {
        const needsAudio = isNaN(prev.audio_edition || NaN);
        const needsText = isNaN(prev.text_edition || NaN);
        const needsQiraat = isNaN(prev.qiraat_reading_id || NaN);
        const textEditionIsTajweed = prev.text_edition === tajweedEdition?.id;

        if (needsAudio || needsText || needsQiraat || textEditionIsTajweed) {
          return {
            ...prev,
            audio_edition: prev.audio_edition || audioEditions[0]?.id || 0,
            text_edition:
              (textEditionIsTajweed
                ? Number(getItem("preferred_translation_edition"))
                : prev.text_edition) ||
              selectableTextEditions[0]?.id ||
              textEditions[0]?.id ||
              0,
            qiraat_reading_id: prev.qiraat_reading_id || qiraats[0]?.id || 0,
          };
        }
        return prev;
      });
    }
  }, [audioEditions, qiraats, selectableTextEditions, tajweedEdition?.id, textEditions]);

  if (isLoading && !data) return <Loading />;
  if (isError)
    return <div className="text-center p-10">{t("Something Went Wrong")}</div>;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Card className="w-full">
          <CardContent>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 justify-between">
                <div className=" w-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("Audio Edition")}
                  </span>
                  <EditionSelector
                    filters={filters}
                    setFilters={setFilters}
                    editions={audioEditions}
                    accessor="audio_edition"
                  />
                </div>
                <div className="w-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("Text Edition")}
                  </span>
                  <EditionSelector
                    filters={filters}
                    setFilters={setFilters}
                    editions={selectableTextEditions}
                    accessor="text_edition"
                  />
                </div>
                <div className="w-full">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("Readings")}
                  </span>
                  <EditionSelector
                    filters={filters}
                    setFilters={setFilters}
                    editions={qiraats}
                    accessor="qiraat_reading_id"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        {showTajweed ? (
          <div
            className={cn(
              "sticky top-[calc(var(--header-height)+0.4rem)] z-30 mb-5",
              showTajweedLegend && "pb-28 sm:pb-24",
            )}
          >
            <div className="tajweed-legend-shell">
              <div className="tajweed-legend-toggle-wrap">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="tajweed-legend-toggle h-8 px-3 text-xs"
                  onClick={handleShowTajweedLegendChange}
                >
                  {t("Tajweed Colors")}
                  <ChevronDown
                    className={cn(
                      "ml-1 h-3.5 w-3.5 transition-transform",
                      showTajweedLegend && "rotate-180",
                    )}
                  />
                </Button>
              </div>
              {showTajweedLegend ? (
                <div className="tajweed-legend-dropdown">
                  <div className="tajweed-legend-bar">
                    <TajweedLegend compact />
                  </div>
                </div>
              ) : null}
              {!canRenderTajweed ? (
                <p className="tajweed-legend-note text-xs text-muted-foreground">
                  {t("Tajweed Edition Compatibility Note")}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <Card className="border-border shadow-sm">
          <CardContent className="flex justify-between items-center w-full px-4 sm:px-6 ">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 group">
                <span className="text-[10px] font-bold uppercase text-muted-foreground mr-2 hidden lg:inline-block">
                  {t("Font Size")}
                </span>
                <div className="flex items-center border rounded-md px-1 bg-background/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    onClick={() =>
                      handleFontSizeChange((f) => Math.max(16, f - 2))
                    }
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-bold w-6 text-center">
                    {fontSize}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md"
                    onClick={() =>
                      handleFontSizeChange((f) => Math.min(80, f + 2))
                    }
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="h-4 w-[1px] bg-border mx-1" />
              <div className="flex items-center gap-2">
                <Switch
                  id="mushaf-tajweed-mode"
                  checked={showTajweed}
                  onCheckedChange={handleShowTajweedChange}
                  className="cursor-pointer"
                />
                <label
                  htmlFor="mushaf-tajweed-mode"
                  className="hidden sm:inline text-[10px] font-bold uppercase text-muted-foreground cursor-pointer"
                >
                  {t("Show Tajweed")}
                </label>
              </div>
              <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Switch
                  id="mushaf-qiraat-diff-mode"
                  checked={showQiraatDiffs}
                  onCheckedChange={handleShowQiraatDiffsChange}
                  className="cursor-pointer"
                />
                <label
                  htmlFor="mushaf-qiraat-diff-mode"
                  className="hidden sm:inline text-[10px] font-bold uppercase text-muted-foreground cursor-pointer"
                >
                  {t("Differences")}
                </label>
              </div>
              <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />
              <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="text-primary">
                  {t("Juz")} {meta.juz_id}
                </span>
                <span className="opacity-30">•</span>
                <span className="hidden md:inline">
                  {t("Hizb")} {meta.hizb_id}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <form
                onSubmit={handleJump}
                className="flex items-center gap-1 bg-muted/50 rounded-md pl-3 pr-1 h-8 border border-border transition-colors focus-within:border-primary/30"
              >
                <span className="text-[9px] font-bold uppercase text-muted-foreground hidden sm:inline">
                  {t("Page")}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  placeholder={pageNumber}
                  className="w-8 bg-transparent text-center text-[11px] font-bold focus:outline-none placeholder:text-muted-foreground/50 text-foreground"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md"
                >
                  <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                </Button>
              </form>
              <div className="h-4 w-[1px] bg-border mx-1" />
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pageInt <= 1}
                  onClick={handlePrevPage}
                  className="h-8 w-8 rounded-md"
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pageInt >= 604}
                  onClick={handleNextPage}
                  className="h-8 w-8 rounded-md"
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <AnimatePresence mode="wait">
          <motion.div
            key={pageNumber}
            initial={{
              opacity: 0,
              x: locale === "ar" || locale === "ku" ? -20 : 20,
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{
              opacity: 0,
              x: locale === "ar" || locale === "ku" ? 20 : -20,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative min-h-[400px] sm:min-h-[800px] w-fit min-w-[320px] max-w-full mx-auto rounded-md px-8 py-12 sm:p-12 md:p-16 flex flex-col items-center overflow-hidden border border-border bg-card text-card-foreground transition-colors duration-300 shadow-sm"
          >
            <MushafBorder />

            <div className="w-full relative z-10">
              {/* Page Top Indicator - Refined for "One-ness" */}
              <div
                className="flex flex-wrap justify-center sm:justify-between items-center gap-y-4 gap-x-8 mb-10 text-[10px] sm:text-xs font-bold text-primary/40 uppercase tracking-[0.2em] border-b border-primary/10 pb-4 w-full"
                dir="rtl"
              >
                <span className="text-primary/60">
                  {ayahs[0] &&
                    allSurahs?.find((s) => s.id === ayahs[0].surah_id)?.name_ar}
                </span>
                <span className="border-x border-primary/10 px-6">
                  {t("Page")} {pageNumber}
                </span>
                <span className="text-primary/60">
                  {t("Juz")} {meta.juz_id}
                </span>
              </div>

              <div
                dir="rtl"
                className={cn(
                  "font-quran-4 ayah text-justify ayah-flow w-full text-foreground/90 select-none",
                  !showQiraatDiffs && "qiraat-diffs-hidden",
                  showTajweed && canRenderTajweed && "tajweed-text",
                )}
                style={{ fontSize: `${fontSize}px`, lineHeight: 2.3 }}
              >
                {ayahs.map((ayah, index) => {
                  let baseTemplate =
                    ayah.ayah_template || ayah.template || ayah.text;
                  baseTemplate = baseTemplate
                    .replace(/^<div[^>]*>/i, "")
                    .replace(/<\/div>$/i, "");

                  const fixedTemplate = baseTemplate.replace(
                    /﴾([\u0660-\u0669]+)﴿/g,
                    "<span class='text-primary font-bold'>﴿$1﴾</span>",
                  );
                  const tajweedText = tajweedByAyahId.get(ayah.id);
                  const renderedAyahHtml = showTajweed && canRenderTajweed && tajweedText
                    ? renderTajweedText(tajweedText, fixedTemplate)
                    : fixedTemplate;

                  const isSurahStart =
                    ayah.number_in_surah === 0 ||
                    (ayah.number_in_surah === 1 && ayah.surah_id === 9);
                  const surahInfo = allSurahs?.find(
                    (s) => s.id === ayah.surah_id,
                  );

                  const handleAyahInteraction = (
                    e: React.MouseEvent | React.TouchEvent | React.PointerEvent,
                    ayah: IAayh,
                  ) => {
                    const target = e.target as HTMLElement;
                    const wordElement = target.closest("span[id]") as HTMLElement | null;
                    const isWordClick = !!wordElement?.id;

                    // Manual differentiation between single/double click and long press
                    if (e.type === "pointerdown") {
                      // START LONG PRESS TIMER (Mobile focused)
                      longPressTimeoutRef.current = setTimeout(() => {
                        setSelectedAyah(ayah);
                        longPressTimeoutRef.current = null;
                      }, 600);
                      return;
                    }

                    if (e.type === "pointerup") {
                      if (longPressTimeoutRef.current) {
                        // If we are here, long press didn't finish
                        clearTimeout(longPressTimeoutRef.current);
                        longPressTimeoutRef.current = null;

                        // Now handle single vs double click
                        if (clickTimeoutRef.current) {
                          // DOUBLE CLICK
                          clearTimeout(clickTimeoutRef.current);
                          clickTimeoutRef.current = null;
                          setSelectedAyah(ayah);
                        } else {
                          // SINGLE CLICK (Wait to see if it's a double)
                          clickTimeoutRef.current = setTimeout(() => {
                            clickTimeoutRef.current = null;
                            if (isWordClick) {
                              toast.info(`${t("Word")}: ${wordElement.id}`, {
                                icon: "📖",
                                duration: 2000,
                              });
                            }
                          }, 250);
                        }
                      }
                      return;
                    }

                    if (
                      e.type === "pointercancel" ||
                      e.type === "pointerleave"
                    ) {
                      if (longPressTimeoutRef.current) {
                        clearTimeout(longPressTimeoutRef.current);
                        longPressTimeoutRef.current = null;
                      }
                    }
                  };

                  return (
                    <Fragment key={ayah.id}>
                      {isSurahStart && (
                        <div className="w-full flex justify-center py-8 my-6 relative">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 text-primary">
                            <svg
                              viewBox="0 0 400 100"
                              className="w-full h-full"
                            >
                              <path
                                d="M50,50 L350,50 M200,20 L200,80"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                              />
                            </svg>
                          </div>
                          <span className="text-2xl sm:text-4xl font-bold text-primary relative z-10">
                            {t("Surah")}{" "}
                            {i18n.language === "ar" || i18n.language === "ku"
                              ? surahInfo?.name_ar
                              : surahInfo?.name_en}
                          </span>
                        </div>
                      )}

                      {ayah.number_in_surah === 0 ? (
                        <div className="w-full text-center py-8 text-[0.85em] text-foreground/80 font-bold tracking-widest">
                          {ayah.text}
                        </div>
                      ) : (
                        <div
                          className="inline transition-all duration-300 px-1 hover:bg-primary/5 hover:text-primary cursor-pointer rounded-sm"
                          onPointerDown={(e) => handleAyahInteraction(e, ayah)}
                          onPointerUp={(e) => handleAyahInteraction(e, ayah)}
                          onPointerCancel={(e) =>
                            handleAyahInteraction(e, ayah)
                          }
                          onPointerLeave={(e) => handleAyahInteraction(e, ayah)}
                          dangerouslySetInnerHTML={{
                            __html: renderedAyahHtml + " ",
                          }}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Interaction Hints */}
      <div className="flex flex-col items-center gap-1 py-4 opacity-60">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          <span className="hidden md:inline">
            {t("Double click for details")} • {t("Single click for word info")}
          </span>
          <span className="md:hidden">
            {t("Long tap for details")} • {t("Single tap for word info")}
          </span>
        </div>
        <div className="hidden md:flex justify-center text-[10px] text-muted-foreground uppercase tracking-widest py-2">
          {t("Use arrows or keyboard to navigate")}
        </div>
      </div>

      {/* Ayah Interaction Modal */}
      <AppDialog
        open={!!selectedAyah}
        onOpenChange={(open) => !open && setSelectedAyah(null)}
        className="max-w-3xl border-none p-0 bg-transparent shadow-none"
      >
        <span className="sr-only">Ayah Actions</span>
        {selectedAyah && (
          <AyahCard
            ayah={selectedAyah}
            isFocusMode={false}
            showQiraatDiffs={showQiraatDiffs}
            showTajweed={showTajweed && canRenderTajweed}
            tajweedText={selectedAyah ? tajweedByAyahId.get(selectedAyah.id) : undefined}
            ignoredActions={["tag"]}
          />
        )}
      </AppDialog>
    </div>
  );
}
