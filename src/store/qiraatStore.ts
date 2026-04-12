import { IQiraat } from "@/types/generalTypes";
import { create } from "zustand";
import api from "@/api/axiosInstance";

interface QiraatState {
  qiraats: IQiraat[];
  fetchQiraats: () => Promise<void>;
}

export const useQiraatStore = create<QiraatState>((set) => ({
  qiraats: [],
  fetchQiraats: async () => {
    try {
      const response = await api.get<{ data: IQiraat[] }>("qiraats");
      set({ qiraats: response.data.data });
    } catch (error) {
      console.error("Error fetching qiraats:", error);
    }
  },
}));
