"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import WorkbenchStats from "@/components/medical/WorkbenchStats";
import { getMedicalDashboard } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import type { SOSAlert } from "@/types/sos";
import type { MonitoringAlert } from "@/types/monitoring";

interface DashboardData {
  pendingSOS: number;
  abnormalCount: number;
  todayConsultations: number;
  onlineElders: number;
  recentSOS: SOSAlert[];
  recentAlerts: MonitoringAlert[];
}

export default function MedicalWorkbenchPage() {
  const router = useRouter();
  const { staffId } = useUserStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMedicalDashboard(staffId);
        setData(result);
      } catch (err) {
        setError("加载工作台数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [staffId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-medical-h1 text-text-primary">工作台</h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-medical p-4 animate-pulse">
              <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="animate-pulse space-y-3 mt-4">
          <div className="h-32 bg-gray-100 rounded-medical" />
          <div className="h-32 bg-gray-100 rounded-medical" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-medical-h1 text-text-primary">工作台</h1>
        <div className="bg-card rounded-medical p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 text-danger/40">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
          </svg>
          <p className="text-medical-body text-danger mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-medical bg-primary text-white text-medical-body"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-medical-h1 text-text-primary">工作台</h1>
        <button
          onClick={() => router.push("/medical/sos/queue")}
          className="px-4 py-2 rounded-medical bg-primary text-white text-medical-body font-medium hover:bg-primary-dark transition-colors"
        >
          SOS呼叫队列
        </button>
      </div>

      {/* Stats */}
      <WorkbenchStats
        pendingSOS={data!.pendingSOS}
        abnormalCount={data!.abnormalCount}
        todayConsultations={data!.todayConsultations}
        onlineElders={data!.onlineElders}
      />

      {/* Quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { href: "/medical/elders/search", label: "老人档案", icon: "search", color: "bg-[#F0F4FF] text-[#2B5CED]" },
          { href: "/medical/sos/queue", label: "SOS 呼叫", icon: "alert", color: "bg-[#FFF1F0] text-danger" },
          { href: "/medical/monitoring", label: "异常监测", icon: "monitor", color: "bg-[#FFF6EF] text-primary" },
          { href: "/medical/announcements", label: "公告通知", icon: "bell", color: "bg-[#F0FFF4] text-success" },
        ].map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className={`${link.color} rounded-medical p-4 text-center hover:opacity-80 transition-opacity`}
          >
            <div className="text-2xl mb-1">
              {link.icon === "search" ? "🔍" : link.icon === "alert" ? "🆘" : link.icon === "monitor" ? "📊" : "📢"}
            </div>
            <div className="text-medical-caption font-medium">{link.label}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Recent SOS */}
        <div className="bg-card rounded-medical overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-medical-h2 text-text-primary font-bold">近期 SOS 呼叫</h2>
            <button
              onClick={() => router.push("/medical/sos/queue")}
              className="text-medical-caption text-primary hover:underline"
            >
              查看全部
            </button>
          </div>
          {data!.recentSOS.length === 0 ? (
            <div className="py-8 text-center text-medical-body text-text-disabled">
              暂无待处理 SOS 呼叫
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data!.recentSOS.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => router.push(`/medical/sos/${alert.id}/accept`)}
                  className="p-4 hover:bg-background cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-medical-body text-text-primary font-medium">{alert.elderName}</span>
                      <span className="text-medical-caption text-text-secondary ml-2">{alert.elderAge}岁</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-medical-caption font-medium ${
                        alert.type === "emergency"
                          ? "bg-danger/10 text-danger"
                          : alert.type === "sub_emergency"
                          ? "bg-warning/10 text-warning"
                          : "bg-gray-100 text-text-secondary"
                      }`}
                    >
                      {alert.type === "emergency" ? "紧急" : alert.type === "sub_emergency" ? "次紧急" : "普通"}
                    </span>
                  </div>
                  <div className="text-medical-caption text-text-secondary mt-1">
                    {alert.address.slice(0, 25)} · {formatTime(alert.triggerTime)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Monitoring */}
        <div className="bg-card rounded-medical overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-medical-h2 text-text-primary font-bold">近期异常监测</h2>
            <button
              onClick={() => router.push("/medical/monitoring")}
              className="text-medical-caption text-primary hover:underline"
            >
              查看全部
            </button>
          </div>
          {data!.recentAlerts.length === 0 ? (
            <div className="py-8 text-center text-medical-body text-text-disabled">
              暂无异常监测
            </div>
          ) : (
            <div className="divide-y divide-border">
              {data!.recentAlerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-background transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-medical-body text-text-primary font-medium">{alert.elderName}</span>
                      <span
                        className={`ml-2 px-1.5 py-0.5 rounded text-medical-caption font-medium ${
                          alert.severity === "high"
                            ? "bg-danger/10 text-danger animate-pulse"
                            : alert.severity === "medium"
                            ? "bg-warning/10 text-warning"
                            : "bg-gray-100 text-text-secondary"
                        }`}
                      >
                        {alert.severity === "high" ? "高" : alert.severity === "medium" ? "中" : "低"}
                      </span>
                    </div>
                    <span className="text-medical-caption text-text-secondary">{formatTime(alert.detectedAt)}</span>
                  </div>
                  <div className="text-medical-caption text-text-secondary mt-1">{alert.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
