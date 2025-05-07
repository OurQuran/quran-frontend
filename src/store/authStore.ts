import api from "@/api/axiosInstance";
import { IUser } from "@/types/authTypes";
import { create } from "zustand";

type AuthStore = {
  user: IUser;
  setUser: (user: IUser) => void;
  fetchMe: () => Promise<void>;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: {} as IUser,
  setUser: (user) => set({ user }),
  fetchMe: async () => {
    try {
      const response = await api.get<{ data: IUser }>("me");
      const user = response.data.data;
      set({ user });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ user: {} as IUser });
    }
  },
  reset: () => set({ user: {} as IUser }),
}));
