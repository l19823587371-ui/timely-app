"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Volume2, VolumeX } from "lucide-react";
import { speak, stopSpeaking } from "@/lib/tts";

interface VoiceBroadcastProps {
  text: string;
  className?: string;
}

export default function VoiceBroadcast({ text, className }: VoiceBroadcastProps) {
  const [playing, setPlaying] = useState(false);

  const handleClick = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      speak(text);
      setPlaying(true);
      if (typeof window !== "undefined") {
        const check = setInterval(() => {
          if (!window.speechSynthesis?.speaking) {
            setPlaying(false);
            clearInterval(check);
          }
        }, 500);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center gap-2 px-5 transition-colors",
        playing
          ? "bg-[#1890FF] text-white"
          : "bg-[#1890FF]/10 text-[#1890FF] hover:bg-[#1890FF]/20",
        className
      )}
    >
      {playing ? <VolumeX size={24} /> : <Volume2 size={24} />}
      <span className="text-elder-body font-medium">{playing ? "停止" : "语音播报"}</span>
    </button>
  );
}
