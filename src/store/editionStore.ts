import { IEdition } from "@/types/generalTypes";
import { create } from "zustand";
import api from "@/api/axiosInstance";

interface EditionState {
  editions: IEdition[];
  textEditions: IEdition[];
  audioEditions: IEdition[];
  fetchEditions: () => Promise<void>;
}

export const useEditionStore = create<EditionState>((set) => ({
  editions: [],
  textEditions: [],
  audioEditions: [],
  fetchEditions: async () => {
    try {
      const response = await api.get<{ data: IEdition[] }>("surahs/editions");
      const editions = response.data.data;
      set({
        editions,
        textEditions: editions.filter((edition) => edition.format === "text"),
        audioEditions: editions.filter((edition) => edition.format === "audio"),
      });
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  },
}));
