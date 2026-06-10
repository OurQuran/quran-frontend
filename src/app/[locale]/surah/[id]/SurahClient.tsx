"use client";

import FadeInUp from "@/components/Animation/FadeInUp";
import AyahCard from "@/components/AyahCard";
import { IFilter, ISurahs } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import EditionSelector from "@/components/EditionSelector";
import { useEditionStore } from "@/store/editionStore";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getItem, setItem } from "@/helpers/localStorage";
import { Switch } from "@/components/ui/switch";
import { useSurahIdsStore } from "@/store/surahsIdStore";
import { useSurahInfinite } from "@/hooks/useSurahInfinite";
import useGet from "@/react-query/useGet";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useRouter, useParams } from "next/navigation";
import { useQiraatStore } from "@/store/qiraatStore";

export default function SurahClient({ id }: { id: string }) {
  const { t, i18n } = useTranslation("global");
  const router = useRouter();
  const { locale } = useParams();
  const { audioEditions, textEditions, fetchEditions } = useEditionStore();
  const { qiraats, fetchQiraats } = useQiraatStore();
  const {
    getNextId,
    getPreviousId,
    canStepBackward,
    canStepForward,
    stepBackward,
    stepForward,
    setSurahIds
  } = useSurahIdsStore();

  const [filters, setFilters] = useState<IFilter>({
    audio_edition: 0,
    text_edition: 0,
    qiraat_reading_id: 0,
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showQiraatDiffs, setShowQiraatDiffs] = useState(true);

  // Initial load from localStorage
  useEffect(() => {
    const savedAudio = getItem("audio_edition");
    const savedText = getItem("text_edition");
    const savedQiraat = getItem("qiraat_reading_id");
    const savedFocus = getItem("focus_mode");
    const savedShowQiraatDiffs = getItem("show_qiraat_diffs");

    setFilters((prev) => ({
      ...prev,
      audio_edition: savedAudio ? parseInt(savedAudio) : prev.audio_edition,
      text_edition: savedText ? parseInt(savedText) : prev.text_edition,
      qiraat_reading_id: savedQiraat ? parseInt(savedQiraat) : prev.qiraat_reading_id,
    }));

    if (savedFocus === "true") {
      setIsFocusMode(true);
    }

    if (savedShowQiraatDiffs === false) {
      setShowQiraatDiffs(false);
    }
  }, []);

  const handleFocusModeChange = (checked: boolean) => {
    setIsFocusMode(checked);
    setItem("focus_mode", checked.toString());
  };

  const handleShowQiraatDiffsChange = (checked: boolean) => {
    setShowQiraatDiffs(checked);
    setItem("show_qiraat_diffs", checked);
  };

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSurahInfinite(id, filters);

  const { data: allSurahs } = useGet<ISurahs[]>("surahs");

  useEffect(() => {
    if (allSurahs?.length) {
      setSurahIds(allSurahs.map((s) => s.id));
    }
    fetchEditions();
    fetchQiraats();
  }, [allSurahs, setSurahIds, fetchEditions, fetchQiraats]);

  const ayahs = data?.pages.flatMap((page) => page.ayahs) ?? [];

  useEffect(() => {
    if (audioEditions.length || textEditions.length || qiraats.length) {
      setFilters((prev) => {
        const needsAudio = isNaN(prev.audio_edition || NaN);
        const needsText = isNaN(prev.text_edition || NaN);
        const needsQiraat = isNaN(prev.qiraat_reading_id || NaN);

        if (needsAudio || needsText || needsQiraat) {
          return {
            ...prev,
            audio_edition: prev.audio_edition || audioEditions[0]?.id || 0,
            text_edition: prev.text_edition || textEditions[0]?.id || 0,
            qiraat_reading_id: prev.qiraat_reading_id || qiraats[0]?.id || 0,
          };
        }
        return prev;
      });
    }
  }, [audioEditions, textEditions, qiraats]);

  return (
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
                  editions={textEditions}
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
      <div className="w-full mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="focus-mode"
              checked={isFocusMode}
              onCheckedChange={handleFocusModeChange}
              className="cursor-pointer"
            />
            <label
              htmlFor="focus-mode"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {t("Focus Mode")}
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="qiraat-diff-mode"
              checked={showQiraatDiffs}
              onCheckedChange={handleShowQiraatDiffsChange}
              className="cursor-pointer"
            />
            <label
              htmlFor="qiraat-diff-mode"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              {t("Show Qiraat Differences")}
            </label>
          </div>
        </div>
      </div>
      <FadeInUp
        className={cn(
          "flex flex-col w-full",
          isFetching && "animate-pulse",
          isFocusMode ? "items-center" : "mt-5",
        )}
      >
        {isLoading ? (
          <Loading />
        ) : (
          ayahs?.map((item, index) => (
            <AyahCard
              key={item.id + index + "ayah-card"}
              ayah={item}
              isFocusMode={isFocusMode}
              showQiraatDiffs={showQiraatDiffs}
              ignoredActions={["surah"]}
            />
          ))
        )}
        <div
          ref={useInfiniteScroll(
            hasNextPage,
            fetchNextPage,
            isFetchingNextPage,
          )}
          className="h-10"
        />
        {isFetchingNextPage && <Loading />}
      </FadeInUp>
      <div
        className={cn(
          "w-full items-center justify-between gap-2 mt-5",
          isLoading ? "hidden" : "flex",
        )}
      >
        <Button
          disabled={!canStepBackward()}
          onClick={() => {
            router.push(`/${locale}/surah/${getPreviousId()}`);
            stepBackward();
          }}
          variant="secondary"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          {t("Previous")}
        </Button>
        <Button
          disabled={!canStepForward()}
          onClick={() => {
            router.push(`/${locale}/surah/${getNextId()}`);
            stepForward();
          }}
          variant="secondary"
          size="sm"
        >
          {t("Next")}
          <ChevronRight className="w-4 h-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
