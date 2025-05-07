import FadeInUp from "@/components/Animation/FadeInUp";
import AyahCard from "@/components/AyahCard";
import { IFilter, IAayh } from "@/types/generalTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import EditionSelector from "@/components/EditionSelector";
import { useEditionStore } from "@/store/editionStore";
import useGet from "@/react-query/useGet";
import { useNavigate, useParams } from "react-router";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getItem, setItem } from "@/helpers/localStorage";
import { Switch } from "@/components/ui/switch";
import { useSurahIdsStore } from "@/store/surahsIdStore";
export default function Surah() {
  const [t] = useTranslation("global");
  const { audioEditions, textEditions } = useEditionStore();
  const {
    getNextId,
    getPreviousId,
    canStepBackward,
    canStepForward,
    stepBackward,
    stepForward,
  } = useSurahIdsStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<IFilter>({
    audio_edition: parseInt(getItem("audio_edition") || ""),
    text_edition: parseInt(getItem("text_edition") || ""),
  });
  const [isFocusMode, setIsFocusMode] = useState(
    getItem("focus_mode") === "true" ? true : false
  );

  const handleFocusModeChange = (checked: boolean) => {
    setIsFocusMode(checked);
    setItem("focus_mode", checked.toString());
  };

  const { data, isLoading, isFetching } = useGet<IAayh[], false>(
    `surahs/${id}`,
    filters,
    true,
    "surah"
  );

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
          isFocusMode ? "items-center" : "mt-5"
        )}
      >
        {isLoading ? (
          <Loading />
        ) : (
          data?.map((item) => (
            <AyahCard
              key={item.id + "ayah-card"}
              ayah={item}
              isFocusMode={isFocusMode}
            />
          ))
        )}
      </FadeInUp>
      <div
        className={cn(
          "w-full items-center justify-between gap-2 mt-5",
          isLoading ? "hidden" : "flex"
        )}
      >
        <Button
          disabled={!canStepBackward()}
          onClick={() => {
            navigate(`/surah/${getPreviousId()}`);
            stepBackward();
          }}
          variant="secondary"
          size="sm"
        >
          <ChevronLeft className="w-4 h-4" />
          {t("Previous")}
        </Button>
        <Button
          disabled={!canStepForward()}
          onClick={() => {
            navigate(`/surah/${getNextId()}`);
            stepForward();
          }}
          variant="secondary"
          size="sm"
        >
          {t("Next")}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
