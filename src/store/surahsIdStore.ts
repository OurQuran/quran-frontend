import { getItem, setItem } from "@/helpers/localStorage";
import { create } from "zustand";

interface SurhaIdsState {
  surahIds: number[];
  index: number;
  setIndex: (index: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
  setSurahIds: (ids: number[]) => void;
  getNextId: () => number | null;
  getPreviousId: () => number | null;
  canStepForward: () => boolean;
  canStepBackward: () => boolean;
}

export const useSurahIdsStore = create<SurhaIdsState>((set, get) => ({
  surahIds: getItem("surahIds") || [],
  index: getItem("index") || 0,
  setIndex: (index: number) => {
    if (index >= 0 && index < get().surahIds.length) {
      set({ index });
    }
  },
  stepForward: () => {
    const state = get();
    if (state.index < state.surahIds.length - 1) {
      set({ index: state.index + 1 });
      setItem("index", state.index + 1);
    }
  },
  stepBackward: () => {
    const state = get();
    if (state.index > 0) {
      set({ index: state.index - 1 });
      setItem("index", state.index - 1);
    }
  },
  setSurahIds: (ids: number[]) => {
    set({ surahIds: ids, index: 0 });
    setItem("surahIds", ids);
    setItem("index", 0);
  },
  getNextId: () => {
    const state = get();
    if (state.index < state.surahIds.length - 1) {
      return state.surahIds[state.index + 1];
    }
    return null;
  },
  getPreviousId: () => {
    const state = get();
    if (state.index > 0) {
      return state.surahIds[state.index - 1];
    }
    return null;
  },
  canStepForward: () => {
    const state = get();
    return state.index < state.surahIds.length - 1;
  },
  canStepBackward: () => {
    const state = get();
    return state.index > 0;
  },
}));
