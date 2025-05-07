import api from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export default function useLogout() {
  const postData = () => {
    return api.post("logout").then((response) => response.data);
  };

  return useMutation({ mutationFn: postData });
}
