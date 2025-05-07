import api, { IApiResponse, IPaginationResponse } from "@/api/axiosInstance";
import { IFilter } from "@/types/generalTypes";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useInfiniteScroll<T>(
  path: string,
  params: IFilter = {},
  enabled = true
) {
  async function fetchData({ pageParam = 1 }) {
    const response = await api.get<IApiResponse<IPaginationResponse<T>>>(path, {
      params: {
        ...params,
        page: pageParam,
      },
    });
    return response.data.data;
  }

  return useInfiniteQuery({
    queryKey: [path, params],
    queryFn: fetchData,
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;

      if (lastPage.meta.total_pages <= lastPage.meta.current_page) {
        return undefined;
      }

      return lastPage.meta.current_page + 1;
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.meta) return undefined;

      if (firstPage.meta.current_page <= 1) {
        return undefined;
      }
      return firstPage.meta.current_page - 1;
    },
  });
}
