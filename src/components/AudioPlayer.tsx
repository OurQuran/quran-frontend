import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import AppTooltip from "./AppTooltip";
import { useTranslation } from "react-i18next";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface AudioPlayerProps {
  audioId: string;
  src: string;
  skipForwardSeconds?: number;
  skipBackwardSeconds?: number;
}

export default function AudioPlayer({
  audioId,
  src,
  skipForwardSeconds = 10,
  skipBackwardSeconds = 10,
}: AudioPlayerProps) {
  const [t] = useTranslation("global");

  const {
    play,
    pause,
    seek,
    setVolume,
    currentTime,
    duration,
    isPlaying,
    setIsMuted,
    isMuted,
    volume,
  } = useAudioPlayer({ audioId, src });

  const togglePlay = () => {
    isPlaying ? pause() : play();
  };

  const skipForward = () => {
    seek(Math.min(currentTime + skipForwardSeconds, duration));
  };

  const skipBackward = () => {
    seek(Math.max(currentTime - skipBackwardSeconds, 0));
  };

  const changeVolume = ([value]: number[]) => {
    setVolume(value);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full mt-5">
      <div className="px-2 sm:p-4 sm:pb-0">
        <div className="space-y-4">
          {/* Slider */}
          <div className="space-y-2">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={(val) => seek(val[0])}
              className="cursor-pointer"
              thumb={(children, index) => (
                <AppTooltip
                  trigger={children}
                  content={
                    <div className="text-sm">{formatTime(currentTime)}</div>
                  }
                  direction="top"
                  key={index}
                />
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            {/* Volume */}
            <div className="flex items-center space-x-2">
              <AppTooltip
                trigger={
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    aria-label={t("Mute")}
                  >
                    {volumeIcon()}
                  </Button>
                }
                content={
                  <div className="text-sm">
                    {isMuted ? t("Unmute") : t("Mute")}
                  </div>
                }
              />
              <div className="w-20 hidden sm:block">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={changeVolume}
                  className="cursor-pointer"
                  thumb={(children, index) => (
                    <AppTooltip
                      trigger={children}
                      content={
                        <div className="text-sm">{t("Adjust volume")}</div>
                      }
                      direction="top"
                      key={index}
                    />
                  )}
                />
              </div>
            </div>

            {/* Play / Skip */}
            <div className="flex items-center flex-1 justify-center space-x-2">
              <AppTooltip
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={skipBackward}
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                }
                content={<div className="text-sm">{t("Skip back")}</div>}
              />
              <AppTooltip
                trigger={
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                }
                content={
                  <div className="text-sm">
                    {isPlaying ? t("Pause") : t("Play")}
                  </div>
                }
              />
              <AppTooltip
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={skipForward}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                }
                content={<div className="text-sm">{t("Skip forward")}</div>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function volumeIcon() {
    if (isMuted) return <VolumeX className="h-5 w-5" />;
    if (volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 0.5) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  }
}
