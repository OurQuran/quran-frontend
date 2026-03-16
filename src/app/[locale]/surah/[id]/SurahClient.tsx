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

export default function SurahClient({ id }: { id: string }) {
  const { t, i18n } = useTranslation("global");
  const router = useRouter();
  const { locale } = useParams();
  const { audioEditions, textEditions } = useEditionStore();
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
  });
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    const savedAudio = getItem("audio_edition");
    const savedText = getItem("text_edition");
    const savedFocus = getItem("focus_mode");

    setFilters((prev) => ({
      ...prev,
      audio_edition: savedAudio ? parseInt(savedAudio) : prev.audio_edition,
      text_edition: savedText ? parseInt(savedText) : prev.text_edition,
    }));

    if (savedFocus === "true") {
      setIsFocusMode(true);
    }
  }, []);

  const handleFocusModeChange = (checked: boolean) => {
    setIsFocusMode(checked);
    setItem("focus_mode", checked.toString());
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
  }, [allSurahs, setSurahIds]);

  const ayahs = data?.pages.flatMap((page) => page.ayahs) ?? [];

  useEffect(() => {
    if (
      (audioEditions.length || textEditions.length) &&
      isNaN(filters.audio_edition || NaN)
    ) {
      setFilters({
        ...filters,
        audio_edition: audioEditions[0].id,
        text_edition: textEditions[0].id,
      });
    }
  }, [audioEditions.length, textEditions.length, filters]);

  return (
    <div>
      <Card className="w-full">
        <CardContent>
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row items-center gap-2 justify-between">
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
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="w-full mt-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
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
          ayahs?.map((item) => (
            <AyahCard
              key={item.id + "ayah-card"}
              ayah={item}
              isFocusMode={isFocusMode}
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
