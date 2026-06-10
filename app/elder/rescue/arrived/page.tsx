"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSOSAlert } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import { LoadingSpinner } from "@/components/shared";
import { LargeButton } from "@/components/elder";
import { Check, MapPin, Clock, Users, Phone } from "lucide-react";
import type { SOSAlert } from "@/types/sos";


function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alertId = searchParams.get("alertId") || "SOS002";
  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSOSAlert(alertId)
      .then(setAlert)
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [alertId]);

  const arrivedStep = alert?.rescueProgress.find(s => s.step === "arrived");
  const triggerTime = alert ? new Date(alert.triggerTime) : null;
  const arrivalTime = arrivedStep?.time
    ? (() => {
        const d = new Date(alert!.triggerTime.split("T")[0] + "T" + arrivedStep.time + "+08:00");
        return d;
      })()
    : null;

  const durationMs = arrivalTime && triggerTime
    ? arrivalTime.getTime() - triggerTime.getTime()
    : null;
  const durationMin = durationMs ? Math.floor(durationMs / 60000) : null;

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;
  if (error) return <><AppHeader title="救援到达" /><div className="px-elder-px pt-6 text-elder-body text-danger text-center">{error}</div></>;
  if (!alert) return <><AppHeader title="救援到达" /><div className="px-elder-px pt-6 text-elder-body text-text-secondary text-center">暂无信息</div></>;

  return (
    <>
      <AppHeader title="救援到达" showBack={false} />

      <div className="px-elder-px py-8 flex flex-col items-center">
        {/* Green Checkmark */}
        <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center mb-6 shadow-lg">
          <Check size={48} className="text-white" strokeWidth={3} />
        </div>

        <h1 className="text-elder-h1 text-success mb-2">救援已到达！</h1>
        <p className="text-elder-body text-text-secondary mb-8">救援人员已抵达您的位置</p>

        {/* Staff Info Card */}
        {alert.assignedStaff && (
          <div className="w-full bg-card rounded-elder p-elder-px flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-elder-h1 text-primary">{alert.assignedStaff.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-elder-h2 text-text-primary">{alert.assignedStaff.name}</p>
              <p className="text-elder-caption text-text-secondary">{alert.assignedStaff.role}</p>
            </div>
            <button className="min-w-elder-touch min-h-elder-btn bg-primary text-white rounded-full flex items-center justify-center">
              <Phone size={28} />
            </button>
          </div>
        )}

        {/* Info Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <div className="bg-card rounded-elder p-4">
            <Clock size={24} className="text-primary mb-2" />
            <p className="text-elder-caption text-text-secondary">到达时间</p>
            <p className="text-elder-body font-bold text-text-primary mt-1">
              {arrivedStep?.time || "--:--"}
            </p>
          </div>
          <div className="bg-card rounded-elder p-4">
            <MapPin size={24} className="text-primary mb-2" />
            <p className="text-elder-caption text-text-secondary">响应时长</p>
            <p className="text-elder-body font-bold text-text-primary mt-1">
              {durationMin !== null ? `${durationMin} 分钟` : "--"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full max-w-sm sm:max-w-md space-y-3">
          <LargeButton
            variant="primary"
            fullWidth
            onClick={() => router.push(`/elder/rescue/rating?alertId=${alertId}`)}
          >
            评价本次服务
          </LargeButton>
          <LargeButton
            variant="ghost"
            fullWidth
            onClick={() => router.push("/elder")}
          >
            返回首页
          </LargeButton>
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
