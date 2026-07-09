import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "@/api/axiosInstance";
import { IAayh, IFilter } from "@/types/generalTypes";

interface MushafResponse {
  data: {
    ayahs: IAayh[];
  };
}

export function useMushafPage(
  pageNumber: string | number,
  filters: IFilter,
  options?: { enabled?: boolean; queryKeyPrefix?: string }
) {
  return useQuery({
    queryKey: [options?.queryKeyPrefix || "mushaf", pageNumber, filters],
    enabled:
      (options?.enabled ?? true) &&
      !!pageNumber &&
      !!filters.audio_edition &&
      !!filters.text_edition &&
      !!filters.qiraat_reading_id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.get<MushafResponse>(`surahs/page/${pageNumber}`, {
        params: {
          ...filters,
          per_page: 100, // Ensure we get all ayahs for the page
        },
      });
      return res.data.data;
    },
  });
}
