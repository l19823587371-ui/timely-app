"use client";

import { useState, useEffect } from "react";

interface VoiceCallControlsProps {
  elderName: string;
  duration: number;
  onHangup: () => void;
  onRecord: () => void;
  onMute: () => void;
  onConnectVideo?: () => void;
  onSpeakerToggle?: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function VoiceCallControls({
  elderName,
  duration,
  onHangup,
  onRecord,
  onMute,
  onConnectVideo,
  onSpeakerToggle,
}: VoiceCallControlsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [elapsed, setElapsed] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Header */}
      <div className="bg-primary px-5 py-4 text-white text-center">
        <div className="text-medical-caption opacity-80">正在与</div>
        <div className="text-medical-h1 mt-1">{elderName}</div>
        <div className="text-2xl font-mono font-bold mt-2">{formatDuration(elapsed)}</div>
      </div>

      {/* Status indicators */}
      <div className="px-5 py-3 flex justify-center gap-4">
        {isRecording && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-medical-caption">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
            录音中
          </span>
        )}
        {isMuted && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 text-warning text-medical-caption">
            已静音
          </span>
        )}
      </div>

      {/* Control buttons */}
      <div className="px-5 pb-5">
        <div className="flex justify-center gap-4">
          {/* Mute */}
          <button
            onClick={() => {
              setIsMuted(!isMuted);
              onMute();
            }}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-colors ${
              isMuted ? "bg-warning text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              {isMuted ? (
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.517 17.072a.75.75 0 101.06 1.06 9.996 9.996 0 003.095-6.917.75.75 0 00-1.5-.1 8.494 8.494 0 01-2.655 5.957z" />
              ) : (
                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              )}
            </svg>
            <span className="text-[11px] mt-0.5">静音</span>
          </button>

          {/* Speaker */}
          <button
            onClick={() => {
              setIsSpeakerOn(!isSpeakerOn);
              onSpeakerToggle?.();
            }}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-colors ${
              isSpeakerOn ? "bg-primary/10 text-primary" : "bg-gray-100 text-text-secondary"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
            </svg>
            <span className="text-[11px] mt-0.5">扬声器</span>
          </button>

          {/* Record */}
          <button
            onClick={() => {
              setIsRecording(!isRecording);
              onRecord();
            }}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center transition-colors ${
              isRecording ? "bg-danger text-white" : "bg-gray-100 text-text-secondary hover:bg-gray-200"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
            <span className="text-[11px] mt-0.5">录音</span>
          </button>

          {/* Video switch */}
          {onConnectVideo && (
            <button
              onClick={onConnectVideo}
              className="w-14 h-14 rounded-full flex flex-col items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
              </svg>
              <span className="text-[11px] mt-0.5">视频</span>
            </button>
          )}
        </div>

        {/* Hangup */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onHangup}
            className="w-16 h-16 rounded-full bg-danger text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M15.22 3.22a.75.75 0 011.06 1.06L4.56 16l-.53.53-1.06-1.06.53-.53L15.22 3.22z" />
            </svg>
          </button>
        </div>
        <div className="text-center mt-2 text-medical-caption text-text-disabled">挂断</div>
      </div>
    </div>
  );
}
