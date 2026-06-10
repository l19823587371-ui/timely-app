"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/useCountdown";
import { triggerSOS, getElderLocation } from "@/lib/api";
import { useSOSStore } from "@/store/sosStore";
import { CountdownRing } from "@/components/shared";
import { LargeButton, VoiceBroadcast } from "@/components/elder";
import { MapPin, AlertTriangle } from "lucide-react";

export default function SOSCountdownPage() {
  const router = useRouter();
  const { setActiveAlert, setCountdownActive, setCountdownRemaining } = useSOSStore();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [location, setLocation] = useState<{ address: string } | null>(null);
  const [alertId, setAlertId] = useState<string | null>(null);

  const handleComplete = useCallback(async () => {
    try {
      const loc = await getElderLocation();
      setLocation(loc);
      const result = await triggerSOS("E001", { lat: loc.lat, lng: loc.lng });
      setAlertId(result.alertId);
      // After SOS triggered, navigate to progress
      router.push(`/elder/rescue/progress?alertId=${result.alertId}`);
    } catch {
      // fallback
      router.push("/elder/rescue/progress");
    }
  }, [router]);

  const { remaining, start, stop } = useCountdown(10, handleComplete);

  // Start countdown on mount
  useState(() => {
    setCountdownActive(true);
    start();
  });

  const handleCancel = () => {
    stop();
    setCountdownActive(false);
    setCountdownRemaining(0);
    router.push("/elder");
  };

  const voiceText = `紧急求助将在 ${remaining} 秒后自动报警。地址：${location?.address || "获取中..."}`;

  return (
    <div className="min-h-screen bg-background px-elder-px pt-6 flex flex-col items-center">
      {/* Warning banner */}
      <div className="w-full bg-bg-alert border border-danger/30 rounded-elder p-4 flex items-center gap-3 mb-8">
        <AlertTriangle size={28} className="text-danger flex-shrink-0" />
        <div>
          <p className="text-elder-h2 text-danger">⚠️ 即将自动报警</p>
          <p className="text-elder-caption text-text-secondary mt-1">
            松开后将自动呼叫救援
          </p>
        </div>
      </div>

      {/* Countdown */}
      <CountdownRing progress={remaining / 10} size={200} strokeWidth={10}>
        <div className="text-center">
          <span className="text-sos-number text-danger">{remaining}</span>
          <p className="text-elder-body text-text-secondary mt-1">秒后自动报警</p>
        </div>
      </CountdownRing>

      {/* Voice broadcast */}
      <div className="mt-8">
        <VoiceBroadcast text={voiceText} />
      </div>

      {/* Location card */}
      <div className="w-full bg-card rounded-elder p-elder-px mt-6 flex items-center gap-3">
        <MapPin size={24} className="text-primary flex-shrink-0" />
        <div>
          <p className="text-elder-caption text-text-secondary">求助位置</p>
          <p className="text-elder-body text-text-primary">
            {location?.address || "正在获取位置..."}
          </p>
        </div>
      </div>

      {/* Cancel button */}
      <div className="mt-10 w-full max-w-sm sm:max-w-md">
        <LargeButton
          variant="secondary"
          fullWidth
          onClick={handleCancel}
        >
          我不想报警，取消
        </LargeButton>
      </div>
    </div>
  );
}
