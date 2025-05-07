import api from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export default function useUpdate<T>(
  path: string,
  onSuccess: (data: T) => void = () => {},
  onError: (error: T) => void = () => {}
) {
  function updateData({ id, data }: { id: string; data: T }) {
    return api.put(`${path}/${id}`, data).then((response) => response.data);
  }

  return useMutation({
    mutationFn: updateData,
    onSuccess,
    onError,
  });
}
