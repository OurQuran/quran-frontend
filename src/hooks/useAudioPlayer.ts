import { useEffect, useRef } from "react";
import { useAudioStore } from "@/store/audioStore";

interface UseAudioPlayerProps {
  audioId: string;
  src: string;
  onEnded?: () => void;
}

export function useAudioPlayer({ audioId, src, onEnded }: UseAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentAudioId,
    isPlaying,
    isMuted,
    volume,
    audios,
    setCurrentAudio,
    setIsPlaying,
    updateAudioTime,
    updateAudioDuration,
    setVolume,
    setIsMuted,
  } = useAudioStore();

  const currentTime = audios[audioId]?.currentTime || 0;
  const duration = audios[audioId]?.duration || 0;

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      updateAudioTime(audioId, audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      updateAudioDuration(audioId, audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.volume = volume;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentAudioId === audioId) {
      isPlaying ? audio.play().catch(console.error) : audio.pause();
    } else {
      audio.pause();
    }
  }, [currentAudioId, isPlaying, audioId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (
      currentAudioId === audioId &&
      Math.abs(audio.currentTime - currentTime) > 0.1
    ) {
      audio.currentTime = currentTime;
    }
  }, [currentTime, currentAudioId, audioId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
  }, [isMuted]);

  const play = () => {
    setCurrentAudio(audioId);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    updateAudioTime(audioId, time);
  };

  const setAudioVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  return {
    play,
    pause,
    seek,
    isMuted,
    volume,
    setVolume: setAudioVolume,
    currentTime,
    duration,
    setIsMuted,
    isPlaying: currentAudioId === audioId && isPlaying,
  };
}
