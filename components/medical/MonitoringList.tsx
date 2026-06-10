"use client";

import type { MonitoringAlert } from "@/types/monitoring";

interface MonitoringListProps {
  alerts: MonitoringAlert[];
  onAcknowledge: (id: string) => void;
  loading?: boolean;
}

const severityConfig: Record<string, { badge: string; bg: string; label: string }> = {
  high: { badge: "bg-danger text-white", bg: "bg-[#FFF1F0]", label: "高" },
  medium: { badge: "bg-warning text-white", bg: "bg-[#FFF8E8]", label: "中" },
  low: { badge: "bg-gray-400 text-white", bg: "bg-gray-50", label: "低" },
};

const typeLabels: Record<string, string> = {
  stillness: "静止异常",
  fall: "跌倒检测",
  heartRate: "心率异常",
  bloodPressure: "血压异常",
};

export default function MonitoringList({ alerts, onAcknowledge, loading }: MonitoringListProps) {
  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--:--";
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-medical p-8">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-medical" />
          ))}
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-card rounded-medical py-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 text-success/30">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
        <p className="text-medical-body text-text-disabled">暂无异常监测</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Mobile cards */}
      <div className="block lg:hidden divide-y divide-border">
        {alerts.map((alert) => {
          const severity = severityConfig[alert.severity] || severityConfig.low;
          return (
            <div key={alert.id} className={`p-4 ${severity.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-medical-h2 text-text-primary">{alert.elderName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-medical-caption font-medium ${severity.badge}`}>
                    {severity.label}
                  </span>
                </div>
                <span className="text-medical-caption text-text-secondary">{formatTime(alert.detectedAt)}</span>
              </div>
              <div className="text-medical-caption text-text-secondary mb-2">
                {typeLabels[alert.type] || alert.type} · {alert.community}
              </div>
              <div className="text-medical-body text-text-primary mb-3">{alert.value}</div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-medical-caption ${alert.acknowledged ? "text-text-disabled" : "text-primary"}`}
                >
                  {alert.acknowledged ? "已确认" : "待确认"}
                </span>
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-medical bg-primary text-white text-medical-caption font-medium hover:bg-primary-dark transition-colors"
                  >
                    确认
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="text-left px-4 py-3 text-medical-caption font-medium text-text-secondary">老人</th>
              <th className="text-left px-4 py-3 text-medical-caption font-medium text-text-secondary">类型</th>
              <th className="text-left px-4 py-3 text-medical-caption font-medium text-text-secondary">严重程度</th>
              <th className="text-left px-4 py-3 text-medical-caption font-medium text-text-secondary">检测时间</th>
              <th className="text-left px-4 py-3 text-medical-caption font-medium text-text-secondary">检测值</th>
              <th className="text-right px-4 py-3 text-medical-caption font-medium text-text-secondary">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {alerts.map((alert) => {
              const severity = severityConfig[alert.severity] || severityConfig.low;
              return (
                <tr
                  key={alert.id}
                  className={`hover:bg-background transition-colors ${
                    alert.severity === "high" ? "bg-[#FFF1F0]/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="text-medical-body text-text-primary font-medium">
                      {alert.elderName}
                    </span>
                    <span className="text-medical-caption text-text-secondary block">
                      {alert.community}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-medical-body text-text-primary">
                      {typeLabels[alert.type] || alert.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-medical-caption font-medium ${
                        severity.badge
                      } ${alert.severity === "high" ? "animate-pulse" : ""}`}
                    >
                      {alert.severity === "high" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                      {severity.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-medical-caption text-text-secondary">
                      {formatTime(alert.detectedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="text-medical-body text-text-primary truncate block">
                      {alert.value}
                    </span>
                    {alert.duration && (
                      <span className="text-medical-caption text-text-disabled">
                        持续 {alert.duration}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {alert.acknowledged ? (
                      <span className="text-medical-caption text-text-disabled">已确认</span>
                    ) : (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="px-3 py-1.5 rounded-medical bg-primary text-white text-medical-caption font-medium hover:bg-primary-dark transition-colors"
                      >
                        确认
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
