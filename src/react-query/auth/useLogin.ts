import api, { IApiResponse } from "@/api/axiosInstance";
import { ILogin, ILoginP } from "@/types/authTypes";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";

export default function useLogin(
  onSuccess?: (data: ILogin) => void,
  onError?: (error: AxiosError<ILogin>) => void
): UseMutationResult<ILogin, AxiosError<ILogin>, ILoginP> {
  const postData = (data: ILoginP) => {
    return api
      .post<IApiResponse<ILogin>>("login", data)
      .then((response) => response.data.data);
  };

  return useMutation<ILogin, AxiosError<ILogin>, ILoginP>({
    mutationFn: postData,
    onSuccess: onSuccess ?? (() => {}),
    onError:
      onError ??
      ((error: AxiosError<ILogin>) => {
        console.error("Error response:", error.response);
      }),
  });
}
