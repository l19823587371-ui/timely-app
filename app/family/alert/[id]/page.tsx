"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSOSAlert } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { SOSAlert } from "@/types/sos";

export default function AlertDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlert = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSOSAlert(id);
      if (!data) {
        setError("未找到该警报记录");
      } else {
        setAlert(data);
      }
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlert();
  }, [fetchAlert]);

  const typeLabel =
    alert?.type === "emergency" ? "紧急求助" : alert?.type === "sub_emergency" ? "次紧急求助" : "普通求助";

  const statusBanner = {
    completed: { bg: "bg-green-50 border-green-200", text: "text-success", label: "✅ 救援已完成", icon: "✅" },
    cancelled: { bg: "bg-gray-50 border-gray-200", text: "text-text-disabled", label: "❌ 已取消", icon: "❌" },
    pending: { bg: "bg-red-50 border-red-200", text: "text-danger", label: "🚨 等待响应", icon: "🚨" },
    accepted: { bg: "bg-yellow-50 border-yellow-200", text: "text-warning", label: "⚠️ 已接单", icon: "⚠️" },
    rescuing: { bg: "bg-bg-warm border-primary/30", text: "text-primary", label: "🏃 救援中", icon: "🏃" },
    arrived: { bg: "bg-bg-warm border-primary/30", text: "text-primary", label: "🏥 已到达", icon: "🏥" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="警报详情" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="警报详情" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]">
          <EmptyState message={error || "未找到记录"} actionLabel="重试" onAction={fetchAlert} />
        </div>
      </div>
    );
  }

  const statusConf = statusBanner[alert.status] || statusBanner.pending;
  const triggerDate = new Date(alert.triggerTime).toLocaleString("zh-CN", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="警报详情" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6 space-y-4">
        {/* Status banner */}
        <div className={`${statusConf.bg} border ${statusConf.text.split(" ")[1]?.replace("text-", "border-") || "border-border"} rounded-family p-4 flex items-center gap-3`}>
          <span className="text-2xl">{statusConf.icon}</span>
          <div>
            <p className={`font-family-h2 font-semibold ${statusConf.text}`}>{statusConf.label}</p>
            <p className="font-family-caption text-text-secondary">{typeLabel}</p>
          </div>
        </div>

        {/* Alert info card */}
        <div className="bg-card rounded-family p-4 space-y-3">
          <h3 className="font-family-h2 text-text-primary">求助信息</h3>
          <div className="space-y-2 font-family-body text-text-secondary">
            <div className="flex justify-between">
              <span>长者姓名</span>
              <span className="text-text-primary">{alert.elderName} · {alert.elderAge}岁</span>
            </div>
            <div className="flex justify-between">
              <span>触发时间</span>
              <span className="text-text-primary">{triggerDate}</span>
            </div>
            <div className="flex justify-between">
              <span>求助类型</span>
              <span className="text-text-primary">{typeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span>地点</span>
              <span className="text-text-primary text-right max-w-[60%]">{alert.address}</span>
            </div>
            {alert.assignedStaff && (
              <div className="flex justify-between">
                <span>响应人员</span>
                <span className="text-text-primary">{alert.assignedStaff.name} · {alert.assignedStaff.role}</span>
              </div>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-card rounded-family overflow-hidden">
          <div className="bg-gray-100 h-48 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl">📍</span>
              <p className="mt-2 font-family-caption text-text-disabled">{alert.address}</p>
            </div>
          </div>
        </div>

        {/* Rescue progress */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-4">救援进度</h3>
          <div className="space-y-0">
            {alert.rescueProgress.map((step, idx) => (
              <div key={step.step} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      step.done
                        ? "bg-success border-success text-white"
                        : idx === alert.rescueProgress.findIndex(s => !s.done)
                        ? "bg-primary border-primary"
                        : "bg-gray-100 border-gray-200 text-text-disabled"
                    }`}
                  >
                    {step.done ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-family-caption">{idx + 1}</span>
                    )}
                  </div>
                  {idx < alert.rescueProgress.length - 1 && (
                    <div className={`w-0.5 h-8 ${step.done ? "bg-success" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="flex-1 pb-3">
                  <p className={`font-family-body ${step.done ? "text-text-primary font-semibold" : "text-text-disabled"}`}>
                    {step.label}
                  </p>
                  {step.time && <p className="font-family-caption text-text-disabled">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video replay link */}
        {alert.videoUrl && (
          <button
            onClick={() => router.push(`/family/alert/${alert.id}/video`)}
            className="w-full min-h-family-btn rounded-family bg-primary text-white font-family-body font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            查看视频回放
          </button>
        )}
      </div>
    </div>
  );
}
