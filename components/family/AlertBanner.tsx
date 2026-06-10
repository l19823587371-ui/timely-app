"use client";

import { useEffect, useState } from "react";
import type { SOSAlert } from "@/types/sos";

interface AlertBannerProps {
  alert: SOSAlert;
  onRespond: () => void;
  onViewDetail: () => void;
}

export default function AlertBanner({ alert, onRespond, onViewDetail }: AlertBannerProps) {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const typeLabel = alert.type === "emergency" ? "紧急求助" : alert.type === "sub_emergency" ? "次紧急求助" : "普通求助";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-red-600 via-red-500 to-red-600 animate-pulse">
      {/* Shake overlay */}
      <div className="absolute inset-0 bg-red-500/30 animate-[shake_0.5s_ease-in-out_infinite]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Alert icon */}
        <div className="mb-6 text-8xl animate-bounce">🚨</div>

        {/* Type badge */}
        <div className="mb-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
          <span className="text-white font-family-h2">{typeLabel}</span>
        </div>

        {/* Elder info */}
        <h1 className="mb-2 font-bold text-white text-[48px] leading-tight" style={{ fontSize: 48 }}>
          {alert.elderName}
        </h1>
        <p className="mb-2 text-white/90 font-family-h2">
          {alert.elderAge}岁 · {alert.elderName}
        </p>
        <p className="mb-8 text-white/80 font-family-caption">{alert.address}</p>

        {/* Auto SMS countdown */}
        <div className="mb-8 flex items-center gap-2 text-white/90 font-family-caption">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {countdown > 0 ? (
            <span>{countdown} 秒后自动发送短信通知</span>
          ) : (
            <span className="text-white font-semibold">短信已自动发送</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 w-64">
          <button
            onClick={onRespond}
            className="w-full min-h-family-btn rounded-family bg-white text-danger font-family-body font-semibold active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
            </svg>
            立即接通
          </button>
          <button
            onClick={onViewDetail}
            className="w-full min-h-family-btn rounded-family border-2 border-white/60 text-white font-family-body active:scale-95 transition-transform"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>
  );
}
