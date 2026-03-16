"use client";

import Loading from "@/components/Loading";
import SearchWithFilters from "@/components/SearchWithFilters";
import SurahCard from "@/components/SurahCard";
import { useTranslation } from "react-i18next";
import { useSurahIdsStore } from "@/store/surahsIdStore";
import { IFilter, ISurahs } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useGet from "@/react-query/useGet";

export default function HomeClient({ initialData }: { initialData: ISurahs[] }) {
  const { t } = useTranslation("global");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setSurahIds } = useSurahIdsStore();

  const [filters, setFilters] = useState<IFilter>({
    name: searchParams.get("name") || "",
    type: searchParams.get("type") || "",
    revelation_order: searchParams.get("revelation_order") || "",
  });

  const { data, isLoading } = useGet<ISurahs[], false>("surahs", filters);

  useEffect(() => {
    setSurahIds([]);
    const displayData = data || initialData;
    if (displayData?.length) {
      setSurahIds(displayData.map((surah) => surah.id));
    }
  }, [data, initialData, setSurahIds]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.name) params.set("name", filters.name);
    if (filters.type) params.set("type", filters.type);
    if (filters.revelation_order) params.set("revelation_order", filters.revelation_order);

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [filters, pathname, router]);

  const displayData = data || initialData;

  return (
    <div>
      <SearchWithFilters filters={filters} setFilters={setFilters} />
      {isLoading && !data ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {displayData?.map((surah, index) => (
            <SurahCard key={surah.id} surah={surah} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
