import Loading from "@/components/Loading";
import SearchWithFilters from "@/components/SearchWithFilters";
import SurahCard from "@/components/SurahCard";
import useGet from "@/react-query/useGet";
import { useSurahIdsStore } from "@/store/surahsIdStore";
import { IFilter, ISurahs } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { getQueryParams, setQueryParams } from "@smart-gate/query-params";

export default function Home() {
  const [filters, setFilters] = useState<IFilter>(getQueryParams() || {});
  const { setSurahIds } = useSurahIdsStore();

  const { data, isLoading } = useGet<ISurahs[], false>("surahs", filters);

  useEffect(() => {
    setSurahIds([]);
    if (data?.length) {
      setSurahIds(data.map((surah) => surah.id));
    }
  }, [data]);

  useEffect(() => {
    setQueryParams(filters);
  }, [filters]);

  return (
    <div>
      <SearchWithFilters filters={filters} setFilters={setFilters} />
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {data?.map((surah, index) => (
            <SurahCard key={surah.id} surah={surah} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
