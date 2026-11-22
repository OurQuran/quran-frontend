import api, { ApiErrorResponse } from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

/**
 * POST mutation. `T` is the request body, `R` the response body and `E` the error;
 * R and E are inferred from the callbacks the caller passes.
 */
export default function useAdd<
  T = unknown,
  R = unknown,
  E = AxiosError<ApiErrorResponse>,
>(path: string, onSuccess: (data: R) => void, onError: (error: E) => void) {
  const postData = (data: T) => {
    return api.post<R>(`${path}`, data).then((response) => response.data);
  };

  return useMutation<R, E, T>({
    mutationFn: postData,
    onSuccess,
    onError,
  });
}
