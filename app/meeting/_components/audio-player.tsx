/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic2,
  Clock,
} from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface CustomAudioPlayerProps {
  recordingUrl?: string;
  isOwner?: boolean;
}

const CustomAudioPlayer = ({
  recordingUrl,
  isOwner = true,
}: CustomAudioPlayerProps) => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const rates = [1, 1.25, 1.5, 2];

  if (!recordingUrl) return null;

  const handlePlayPause = () => {
    const audio = playerRef.current?.audio?.current;
    if (!audio) return;

    // Sync playback rate on interaction
    audio.playbackRate = playbackRate;

    if (isPlaying) audio.pause();
    else audio.play();
  };

  const skip = (seconds: number) => {
    if (!playerRef.current?.audio?.current) return;
    const audio = playerRef.current.audio.current;
    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + seconds),
    );
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (!playerRef.current?.audio?.current) return;
    const audio = playerRef.current.audio.current;
    audio.volume = newVolume;
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!playerRef.current?.audio?.current) return;
    const audio = playerRef.current.audio.current;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (newTime: number) => {
    if (!playerRef.current?.audio?.current) return;
    const audio = playerRef.current.audio.current;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (playerRef.current?.audio?.current) {
      playerRef.current.audio.current.playbackRate = rate;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed bottom-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-4 md:p-6 transition-all duration-500`}
      style={
        isOwner
          ? {
              left: "var(--sidebar-width, 16rem)",
              right: "var(--chat-width, 24rem)",
            }
          : { left: 0, right: 0 }
      }
    >
      <div style={{ display: "none" }}>
        <AudioPlayer
          ref={playerRef}
          src={recordingUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onListen={(e) => {
            const audio = e.target as HTMLAudioElement;
            if (audio && audio.currentTime) {
              setCurrentTime(audio.currentTime);
            }
          }}
          onLoadedMetaData={(e) => {
            const audio = e.target as HTMLAudioElement;
            if (audio && audio.duration) {
              setDuration(audio.duration);
            }
          }}
          volume={volume}
          hasDefaultKeyBindings={true}
          autoPlayAfterSrcChange={false}
          showSkipControls={false}
          showJumpControls={false}
          showDownloadProgress={false}
          showFilledProgress={false}
        />
      </div>

      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 group">
          <div className="flex justify-between text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="relative h-1.5 w-full bg-muted/40 rounded-full overflow-hidden cursor-pointer">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              layoutId="audioProgress"
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 md:gap-8">
          <div className="hidden lg:flex items-center gap-3 min-w-35">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Mic2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground truncate">
                Meeting Audio
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Recording
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(-10)}
              className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-full"
            >
              <SkipBack className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <Button
              onClick={handlePlayPause}
              className="h-10 w-10 md:h-12 md:w-12 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all p-0"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 md:h-6 md:w-6 fill-current" />
              ) : (
                <Play className="h-5 w-5 md:h-6 md:w-6 fill-current translate-x-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(10)}
              className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all rounded-full"
            >
              <SkipForward className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-end gap-3 md:gap-5 min-w-35 md:min-w-60">
l            <div className="flex items-center bg-muted/30 p-1 rounded-full border border-border/50">
              {rates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeRate(rate)}
                  className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all ${
                    playbackRate === rate
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 group w-24 md:w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8 text-muted-foreground hover:text-foreground p-0"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomAudioPlayer;
