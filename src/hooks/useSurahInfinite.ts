import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/api/axiosInstance";
import { IAayh, IFilter } from "@/types/generalTypes";

interface SurahResponse {
  data: {
    meta: {
      current_page: number;
      total_pages: number;
    };
    ayahs: IAayh[];
  };
}

export function useSurahInfinite(
  surahId: string | undefined,
  filters: IFilter,
  options?: { enabled?: boolean; queryKeyPrefix?: string }
) {
  return useInfiniteQuery({
    queryKey: [options?.queryKeyPrefix || "surah", surahId, filters],
    enabled:
      (options?.enabled ?? true) &&
      !!surahId &&
      !!filters.audio_edition &&
      !!filters.text_edition &&
      !!filters.qiraat_reading_id,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await api.get<SurahResponse>(`surahs/${surahId}`, {
        params: {
          ...filters,
          page: pageParam,
        },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage.meta;
      return current_page < total_pages ? current_page + 1 : undefined;
    },
  });
}
