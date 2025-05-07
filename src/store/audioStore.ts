import { create } from "zustand";

interface AudioMeta {
  currentTime: number;
  duration: number;
}

interface AudioState {
  currentAudioId: string | null;
  isPlaying: boolean;
  isMuted: boolean;
  audios: Record<string, AudioMeta>;
  volume: number;
  setCurrentAudio: (audioId: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsMuted: (isMuted: boolean) => void;
  updateAudioTime: (audioId: string, time: number) => void;
  updateAudioDuration: (audioId: string, duration: number) => void;
  setVolume: (volume: number) => void;
  reset: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  currentAudioId: null,
  isPlaying: false,
  isMuted: false,
  audios: {},
  volume: 1,
  setCurrentAudio: (audioId) => set({ currentAudioId: audioId }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsMuted: (isMuted) => set({ isMuted }),
  updateAudioTime: (audioId, time) =>
    set((state) => ({
      audios: {
        ...state.audios,
        [audioId]: {
          ...state.audios[audioId],
          currentTime: time,
        },
      },
    })),

  updateAudioDuration: (audioId, duration) =>
    set((state) => ({
      audios: {
        ...state.audios,
        [audioId]: {
          ...state.audios[audioId],
          duration,
        },
      },
    })),

  setVolume: (volume) => set({ volume }),

  reset: () =>
    set({
      currentAudioId: null,
      isPlaying: false,
      audios: {},
      volume: 1,
    }),
}));
