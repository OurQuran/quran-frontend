"use client";

import Loading from "@/components/Loading";
import useGet from "@/react-query/useGet";
import { IAayh, IFilter } from "@/types/generalTypes";
import { useEffect, useState } from "react";
import FadeInUp from "@/components/Animation/FadeInUp";
import { cn } from "@/lib/utils";
import AyahCard from "@/components/AyahCard";
import { TablePagination } from "@/components/TablePagination";
import AdvancedSearchFilters from "@/components/AdvancedSearchFilters";
import { useTranslation } from "react-i18next";
import { useLenis } from "@/hooks/useLenis";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function AdvancedSearchClient() {
  const { t } = useTranslation("global");
  const lenisRef = useLenis();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<IFilter>({
    page: parseInt(searchParams.get("page") || "1"),
    per_page: parseInt(searchParams.get("per_page") || "10"),
    type: searchParams.get("type") || "semantic",
    q: searchParams.get("q") || "",
  });

  const { data, isLoading, isFetching, refetch } = useGet<IAayh, true>(
    "search",
    filters,
    false
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.type) params.set("type", filters.type);
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.per_page) params.set("per_page", filters.per_page.toString());

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router]);

  useEffect(() => {
    if (filters?.q) {
      refetch();
    }
  }, [filters.q, filters.type, filters.page, filters.per_page, refetch]);

  useEffect(() => {
    lenisRef.current?.scrollTo(0);
  }, [filters, lenisRef]);

  return (
    <div>
      <AdvancedSearchFilters filters={filters} setFilters={setFilters} />
      {filters?.q ? (
        <FadeInUp
          className={cn(
            "flex flex-col w-full mt-5",
            isFetching && "animate-pulse"
          )}
        >
          {isLoading ? (
            <Loading />
          ) : (
            data?.result.map((item) => (
              <AyahCard key={item.id + "ayah-card"} ayah={item} />
            ))
          )}
        </FadeInUp>
      ) : (
        <div className="text-center h-full flex items-center justify-center mt-40">
          <p className="text-md mt-2">
            {t("Enter your search query to find relevant verses")}
          </p>
        </div>
      )}
      {data?.meta && filters?.q && (
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
