import api from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export default function useAdd<T>(
  path: string,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) {
  const postData = (data: T) => {
    return api.post(`${path}`, data).then((response) => response.data);
  };

  return useMutation({
    mutationFn: postData,
    onSuccess,
    onError,
  });
}
