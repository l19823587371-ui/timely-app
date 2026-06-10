"use client";

import type { SOSAlert } from "@/types/sos";

interface CallCardProps {
  alert: SOSAlert;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onRescue: () => void;
}

const urgencyColors: Record<string, string> = {
  emergency: "border-l-danger",
  sub_emergency: "border-l-warning",
  normal: "border-l-gray-400",
};

const urgencyLabels: Record<string, { text: string; bg: string }> = {
  emergency: { text: "紧急", bg: "bg-danger" },
  sub_emergency: { text: "次紧急", bg: "bg-warning" },
  normal: { text: "普通", bg: "bg-gray-500" },
};

export default function CallCard({ alert, onVoiceCall, onVideoCall, onRescue }: CallCardProps) {
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "--:--:--";
    }
  };

  const urgency = urgencyLabels[alert.type] || urgencyLabels.normal;

  return (
    <div className={`bg-card rounded-medical border-l-4 ${urgencyColors[alert.type] || "border-l-gray-400"} overflow-hidden`}>
      {/* Urgency banner */}
      <div className={`${urgency.bg} text-white px-5 py-2 flex items-center justify-between`}>
        <span className="text-medical-h2 font-bold">{urgency.text}呼叫</span>
        <span className="text-medical-caption opacity-80">ID: {alert.id}</span>
      </div>

      {/* Elder info */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {alert.elderName.charAt(0)}
          </div>
          <div>
            <div className="text-medical-h1 text-text-primary">{alert.elderName}</div>
            <div className="text-medical-caption text-text-secondary">
              {alert.elderAge}岁 · {alert.address.slice(0, 20)}
            </div>
          </div>
        </div>

        {/* Trigger time */}
        <div className="flex items-center gap-2 text-medical-body text-text-secondary bg-background rounded-medical p-3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-danger">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          <span>触发时间：{formatTime(alert.triggerTime)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-medical-body text-text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{alert.address}</span>
        </div>

        {/* Family status */}
        <div className="flex items-center gap-4 text-medical-caption">
          <span className={`px-2 py-1 rounded-full ${alert.familyNotified ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
            {alert.familyNotified ? "已通知家属" : "未通知家属"}
          </span>
          <span className={`px-2 py-1 rounded-full ${alert.familyAccepted ? "bg-success/10 text-success" : "bg-gray-100 text-text-disabled"}`}>
            {alert.familyAccepted ? "家属已确认" : "家属未确认"}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={onVoiceCall}
          className="py-3 rounded-medical bg-primary/10 text-primary text-medical-body font-medium hover:bg-primary/20 transition-colors flex flex-col items-center gap-1 min-h-medical-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
          语音接诊
        </button>
        <button
          onClick={onVideoCall}
          className="py-3 rounded-medical bg-primary/10 text-primary text-medical-body font-medium hover:bg-primary/20 transition-colors flex flex-col items-center gap-1 min-h-medical-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
          </svg>
          视频接诊
        </button>
        <button
          onClick={onRescue}
          className="py-3 rounded-medical bg-danger text-white text-medical-body font-medium hover:bg-red-600 transition-colors flex flex-col items-center gap-1 min-h-medical-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
          前往救援
        </button>
      </div>
    </div>
  );
}
