"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface VideoEvent {
  time: string;
  label: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  events: VideoEvent[];
}

function timeToSeconds(time: string): number {
  const [m, s] = time.split(":").map(Number);
  return m * 60 + s;
}

export default function VideoPlayer({ videoUrl, events }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 300; // Mock 5 min duration
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && currentTime >= duration) {
        setCurrentTime(0); // Restart if at end
      }
      return !prev;
    });
  }, [currentTime, duration]);

  // Auto-progress when playing (mock)
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((t) => {
          if (t >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, duration]);

  const progress = (currentTime / (duration || 1)) * 100;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    setCurrentTime(Math.floor(pct * duration));
  };

  return (
    <div className="bg-card rounded-family overflow-hidden">
      {/* Video area placeholder */}
      <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />

        {/* Mock keyframe thumbnails */}
        <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-1 opacity-30">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-700 flex items-center justify-center">
              <span className="text-white/50 font-family-caption">帧 {i}</span>
            </div>
          ))}
        </div>

        {/* Play button overlay */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="relative z-10 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {isPlaying && (
          <button
            onClick={togglePlay}
            className="relative z-10 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>
        )}

        {/* Time display */}
        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded font-family-caption">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Timeline with event markers */}
      <div className="px-4 pt-3 pb-2">
        <div
          ref={progressRef}
          className="relative h-8 cursor-pointer group"
          onClick={seekTo}
        >
          {/* Track */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow -ml-2 transition-all"
            style={{ left: `${progress}%` }}
          />

          {/* Event markers */}
          {events.map((event) => {
            const eventSec = timeToSeconds(event.time);
            const eventPos = (eventSec / (duration || 1)) * 100;
            return (
              <div
                key={event.time}
                className="absolute top-0 -translate-x-1/2 group/marker"
                style={{ left: `${eventPos}%` }}
              >
                <div className="w-3 h-3 bg-white border-2 border-primary rounded-full" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {event.time} {event.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Event labels */}
        <div className="flex justify-between mt-1">
          {events.map((event) => (
            <span key={event.time} className="font-family-caption text-text-disabled">
              {event.label}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 border-t border-border flex items-center gap-4">
        <button onClick={togglePlay} className="text-primary">
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <span className="font-family-caption text-text-secondary">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
        <div className="flex-1" />
        <button className="text-text-secondary p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M8.464 15.536a5 5 0 010-7.072m-2.828 9.9a9 9 0 010-12.728" />
          </svg>
        </button>
      </div>
    </div>
  );
}
