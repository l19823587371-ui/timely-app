"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSOSProgress, getSOSAlert, getElderLocation } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import { useSOSStore } from "@/store/sosStore";
import AppHeader from "@/components/shared/AppHeader";
import { ProgressSteps, MapView, LoadingSpinner } from "@/components/shared";
import { VoiceBroadcast, LargeButton } from "@/components/elder";
import { Phone, MapPin, Users } from "lucide-react";
import type { SOSAlert, RescueStep } from "@/types/sos";


function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alertId = searchParams.get("alertId") || "SOS002";
  const { activeAlert, setActiveAlert, updateProgress } = useSOSStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const fetchAlert = useCallback(async () => {
    try {
      const alert = await getSOSAlert(alertId);
      if (alert) setActiveAlert(alert);
    } catch { /* ignore */ }
  }, [alertId, setActiveAlert]);

  const pollProgress = useCallback(async () => {
    try {
      const { steps, status } = await getSOSProgress(alertId);
      updateProgress(steps, status as SOSAlert["status"]);
      if (status === "arrived" || status === "completed") {
        router.push(`/elder/rescue/arrived?alertId=${alertId}`);
      }
    } catch { /* ignore */ }
  }, [alertId, updateProgress, router]);

  useEffect(() => {
    const init = async () => {
      try {
        const [alert, loc] = await Promise.all([getSOSAlert(alertId), getElderLocation()]);
        if (alert) setActiveAlert(alert);
        setLocation(loc);
      } catch {
        setError("加载失败");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [alertId, setActiveAlert]);

  usePolling(pollProgress, 3000);

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  if (error) {
    return (
      <>
        <AppHeader title="救援进度" />
        <div className="px-elder-px pt-6 text-elder-body text-danger text-center">{error}</div>
      </>
    );
  }

  const alert = activeAlert;
  if (!alert) {
    return (
      <>
        <AppHeader title="救援进度" />
        <div className="px-elder-px pt-6 text-elder-body text-text-secondary text-center">暂无救援信息</div>
      </>
    );
  }

  const voiceText = `救援正在赶来。当前位置：${location?.address || alert.address}。已通知家属。`;

  const currentStep = alert.rescueProgress.filter(s => s.done).length;

  return (
    <>
      <AppHeader title="救援进度" />

      <div className="px-elder-px py-4 space-y-5">
        {/* Status Banner */}
        <div className="bg-primary/10 rounded-elder p-4 text-center">
          <p className="text-elder-h2 text-primary">
            {currentStep >= 4 ? "救援人员已到达" :
             currentStep >= 3 ? "救援人员正在赶来" :
             currentStep >= 2 ? "救援已接单" : "已报警，等待响应"}
          </p>
          <p className="text-elder-caption text-text-secondary mt-1">
            触发时间: {new Date(alert.triggerTime).toLocaleTimeString("zh-CN", { hour12: false })}
          </p>
        </div>

        {/* Map */}
        {location && (
          <MapView
            markers={[
              { lat: location.lat, lng: location.lng, label: "我的位置" },
              { lat: location.lat + 0.001, lng: location.lng + 0.002, label: "救援人员" },
            ]}
            height={200}
          />
        )}

        {/* Progress Steps */}
        <div className="bg-card rounded-elder p-elder-px">
          <h3 className="text-elder-h2 mb-4">救援步骤</h3>
          <ProgressSteps steps={alert.rescueProgress} />
        </div>

        {/* Rescue Staff */}
        {alert.assignedStaff && (
          <div className="bg-card rounded-elder p-elder-px flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Users size={28} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-elder-body font-bold">{alert.assignedStaff.name}</p>
              <p className="text-elder-caption text-text-secondary">{alert.assignedStaff.role}</p>
            </div>
            <button className="min-w-elder-touch min-h-elder-btn bg-primary text-white rounded-full flex items-center justify-center">
              <Phone size={24} />
            </button>
          </div>
        )}

        {/* Voice Broadcast */}
        <VoiceBroadcast text={voiceText} />

        {/* Family Notified */}
        <div className="bg-card rounded-elder p-elder-px flex items-center gap-3">
          <Users size={24} className="text-success" />
          <div>
            <p className="text-elder-body text-text-primary">
              {alert.familyNotified ? "已通知家属" : "正在通知家属..."}
            </p>
            {alert.familyNotified && (
              <p className="text-elder-caption text-text-secondary mt-1">
                {alert.familyAccepted ? "家属已确认" : "等待家属确认"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-secondary">加载中...</p></div>}>
      <PageContent />
    </Suspense>
  );
}
