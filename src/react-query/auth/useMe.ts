import api, { IApiResponse } from "@/api/axiosInstance";
import { IUser } from "@/types/authTypes";
import { useQuery } from "@tanstack/react-query";

export default function useMe(enabled = true) {
  function fetchData() {
    return api
      .get<IApiResponse<IUser>>(`me`)
      .then((response) => response.data.data);
  }
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchData,
    enabled: enabled,
  });
}
