"use client";

import type { HealthRecord } from "@/types/health";

interface VitalsOverlayData {
  heartRate?: number;
  spo2?: number;
  bloodPressure?: { systolic: number; diastolic: number };
}

interface VideoCallViewProps {
  elderName: string;
  vitals?: VitalsOverlayData;
  onScreenshot?: () => void;
  onRecord?: () => void;
  onHangup: () => void;
  onMute?: () => void;
  onSpeakerToggle?: () => void;
}

export default function VideoCallView({
  elderName,
  vitals,
  onScreenshot,
  onRecord,
  onHangup,
  onMute,
  onSpeakerToggle,
}: VideoCallViewProps) {
  return (
    <div className="relative w-full" style={{ minHeight: "500px" }}>
      {/* Main video area (elder's view) */}
      <div className="relative w-full rounded-medical overflow-hidden bg-gray-900" style={{ minHeight: "500px" }}>
        {/* Elder video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 text-gray-500">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-400 text-medical-body">{elderName} 视频画面</p>
            <p className="text-gray-600 text-medical-caption mt-1">连接中...</p>
          </div>
        </div>

        {/* Vitals floating overlay */}
        {vitals && (
          <div className="absolute top-4 left-4 space-y-2">
            {vitals.heartRate !== undefined && (
              <div className="bg-black/60 backdrop-blur-sm rounded-medical px-3 py-2 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-danger animate-pulse">
                  <path d="M9.653 16.915l-.005-.003a.75.75 0 10-.717 0l-.005.003C8.8 16.965 3.5 14.35 3.5 8.5a4.5 4.5 0 018.5 0 4.5 4.5 0 018.5 0c0 5.85-5.3 8.465-5.5 8.505l.153-.09z" />
                </svg>
                <span className="text-medical-caption">{vitals.heartRate} BPM</span>
              </div>
            )}
            {vitals.spo2 !== undefined && (
              <div className="bg-black/60 backdrop-blur-sm rounded-medical px-3 py-2 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                  <path d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0z" />
                </svg>
                <span className="text-medical-caption">SpO₂ {vitals.spo2}%</span>
              </div>
            )}
            {vitals.bloodPressure && (
              <div className="bg-black/60 backdrop-blur-sm rounded-medical px-3 py-2 text-white">
                <span className="text-medical-caption">
                  BP {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Elder name label */}
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-medical-caption">
          {elderName}
        </div>
      </div>

      {/* Self-view (small) */}
      <div className="absolute top-4 right-4 w-32 h-40 rounded-medical overflow-hidden border-2 border-white/30 shadow-lg bg-gray-700">
        <div className="w-full h-full flex items-center justify-center text-white/60 text-medical-caption">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mx-auto mb-1 opacity-50">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            我
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        <button
          onClick={onMute}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          title="静音"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          </svg>
        </button>
        <button
          onClick={onSpeakerToggle}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          title="扬声器"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
          </svg>
        </button>
        <button
          onClick={onScreenshot}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          title="截图"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button
          onClick={onRecord}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
          title="录像"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
            <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
          </svg>
        </button>
        <button
          onClick={onHangup}
          className="w-14 h-12 rounded-full bg-danger text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          title="挂断"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M15.22 3.22a.75.75 0 011.06 1.06L4.56 16l-.53.53-1.06-1.06.53-.53z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
