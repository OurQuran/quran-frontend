import api, { IApiResponse, IPaginationResponse } from "@/api/axiosInstance";
import { IFilter } from "@/types/generalTypes";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function useGet<T, P extends boolean = false>(
  path: string,
  params: IFilter = {},
  enabled = true,
  extraKey: string = ""
) {
  function fetchData(): Promise<P extends true ? IPaginationResponse<T> : T> {
    return api
      .get<IApiResponse<P extends true ? IPaginationResponse<T> : T>>(path, {
        params,
      })
      .then((response) => response.data.data);
  }

  return useQuery({
    queryKey: extraKey ? [extraKey, path, params] : [path, params],
    queryFn: fetchData,
    enabled,
    placeholderData: keepPreviousData,
  });
}
