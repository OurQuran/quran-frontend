import Loading from "@/components/Loading";
import SearchWithFilters from "@/components/SearchWithFilters";
import SurahCard from "@/components/SurahCard";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import useGet from "@/react-query/useGet";
import { useSurahIdsStore } from "@/store/surahsIdStore";
import { IFilter, ISurahs } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { getQueryParams, setQueryParams } from "@smart-gate/query-params";

export default function Home() {
  const { t } = useTranslation("global");
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
      <Helmet>
        <title>
          {filters.name
            ? t("Search results for {{query}} - Our Quran", {
                query: filters.name,
              })
            : t("Our Quran - Read, Listen, and Search")}
        </title>
        {filters.name && (
          <meta
            name="description"
            content={t("Explore search results for {{query}} in Our Quran.", {
              query: filters.name,
            })}
          />
        )}
      </Helmet>
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
