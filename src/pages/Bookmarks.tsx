import FadeInUp from "@/components/Animation/FadeInUp";
import AyahCard from "@/components/AyahCard";
import Loading from "@/components/Loading";
import { TablePagination } from "@/components/TablePagination";
import { useLenis } from "@/hooks/useLenis";
import { cn } from "@/lib/utils";
import useGet from "@/react-query/useGet";
import { IFilter, IAayh } from "@/types/generalTypes";
import { getQueryParams, setQueryParams } from "@smart-gate/query-params";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Bookamarks() {
  const [filters, setFilters] = useState<IFilter>({
    page: 1,
    per_page: 10,
    ...getQueryParams(),
  });
  const { data, isLoading } = useGet<IAayh, true>("bookmarks", filters);
  const { t } = useTranslation("global");
  const lenisRef = useLenis();

  useEffect(() => {
    lenisRef.current?.scrollTo(0);
  }, [filters]);

  useEffect(() => {
    setQueryParams(filters);
  }, [filters]);

  return (
    <div className="flex flex-col w-full mt-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-semibold">{t("Bookmarks")}</h1>
        <p className="text-gray-600 mt-2">
          {data?.meta?.total_count || 0}{" "}
          {t(data?.meta?.total_count === 1 ? "Bookamrk" : "Bookmarks")}
        </p>
      </div>
      <FadeInUp className={cn("flex flex-col w-full mt-5")}>
        {isLoading ? (
          <Loading />
        ) : (
          data?.result.map((item) => (
            <AyahCard
              key={item.id + "ayah-card"}
              ayah={item}
              hasAudio={false}
              surahLink={true}
            />
          ))
        )}
      </FadeInUp>
      {data?.meta && (
        <TablePagination
          className="mt-5"
          pageSize={filters.per_page || 10}
          currentPage={data?.meta?.current_page || 1}
          totalPages={data?.meta?.total_pages || 1}
          onPageChange={(newPage) => {
            setFilters((prev) => ({
              ...prev,
              page: newPage,
            }));
          }}
          onPageSizeChange={(newPageSize) => {
            setFilters((prev) => ({
              ...prev,
              per_page: newPageSize,
            }));
          }}
        />
      )}
    </div>
  );
}
