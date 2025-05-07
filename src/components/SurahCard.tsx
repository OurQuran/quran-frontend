// components/SurahCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { setItem } from "@/helpers/localStorage";
import { useSurahIdsStore } from "@/store/surahsIdStore";
import { ISurahs } from "@/types/generalTypes";
import { Link } from "react-router";

export default function SurahCard({
  surah,
  index,
}: {
  surah: ISurahs;
  index: number;
}) {
  const { setIndex } = useSurahIdsStore();
  return (
    <Link
      to={`/surah/${surah.id}`}
      onClick={() => {
        setIndex(index);
        setItem("index", index);
      }}
    >
      <Card className="w-full transition-all duration-200 hover:border-primary hover:shadow-md">
        <CardContent className="flex items-center justify-between ">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary  rounded-md  flex items-center justify-center rotate-45">
            <span className="-rotate-45 font-semibold text-primary-foreground text-md">
              {surah.id}
            </span>
          </div>

          <div className="flex-1 px-4 ">
            <div className="text-lg font-bold font-poppins">
              {surah.name_en}
            </div>
            <div className="text-sm text-accent font-semibold">
              {surah.name_en_translation}
            </div>
          </div>

          <div className=" flex flex-col items-start justify-center">
            <div className=" text-lg font-bold font-quran-1">
              {surah.name_ar}
            </div>
            <div className=" text-sm text-accent ">{surah.type}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
