import api from "@/api/axiosInstance";
import { IUser } from "@/types/authTypes";
import { create } from "zustand";

type AuthStore = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  fetchMe: () => Promise<void>;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchMe: async () => {
    try {
      const response = await api.get<{ data: IUser }>("me");
      const user = response.data.data;
      set({ user });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ user: null });
    }
  },
  reset: () => set({ user: null }),
}));
