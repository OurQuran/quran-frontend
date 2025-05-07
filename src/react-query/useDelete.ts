import api from "@/api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDelete<T>(
  path: string,
  onSuccess: (data: T) => void = () => {},
  onError: (error: T) => void = () => {}
) {
  const queryClient = useQueryClient();
  function deleteData(id: string) {
    return api.delete(`${path}/${id}`).then((response) => response.data);
  }

  return useMutation({
    mutationFn: deleteData,
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      onSuccess(data);
    },
    onError,
  });
}
