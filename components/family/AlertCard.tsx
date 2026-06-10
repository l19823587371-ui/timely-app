"use client";

import type { SOSAlert } from "@/types/sos";

interface AlertCardProps {
  alert: SOSAlert;
  onClick: () => void;
}

const typeConfig: Record<string, { label: string; stripeColor: string }> = {
  emergency: { label: "紧急", stripeColor: "bg-danger" },
  sub_emergency: { label: "次紧急", stripeColor: "bg-warning" },
  normal: { label: "普通", stripeColor: "bg-gray-400" },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "待处理", color: "text-danger", bg: "bg-red-50" },
  accepted: { label: "已接单", color: "text-warning", bg: "bg-yellow-50" },
  rescuing: { label: "救援中", color: "text-primary", bg: "bg-bg-warm" },
  arrived: { label: "已到达", color: "text-primary", bg: "bg-bg-warm" },
  completed: { label: "已完成", color: "text-success", bg: "bg-green-50" },
  cancelled: { label: "已取消", color: "text-text-disabled", bg: "bg-gray-50" },
};

export default function AlertCard({ alert, onClick }: AlertCardProps) {
  const typeInfo = typeConfig[alert.type] || typeConfig.normal;
  const statusInfo = statusConfig[alert.status] || statusConfig.pending;

  const formattedDate = new Date(alert.triggerTime).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-family overflow-hidden flex cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Left color stripe */}
      <div className={`w-1 flex-shrink-0 ${typeInfo.stripeColor}`} />

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-family-h2 text-text-primary">{alert.elderName}</span>
            {alert.elderAge && (
              <span className="font-family-caption text-text-secondary">{alert.elderAge}岁</span>
            )}
          </div>
          <span
            className={`inline-block px-2 py-0.5 rounded-full font-family-caption ${statusInfo.color} ${statusInfo.bg}`}
          >
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center gap-3 font-family-caption text-text-secondary">
          <span>
            {alert.type === "emergency" ? "🚨" : alert.type === "sub_emergency" ? "⚠️" : "ℹ️"}{" "}
            {typeInfo.label}
          </span>
          <span>📅 {formattedDate}</span>
        </div>

        {alert.address && (
          <p className="mt-2 font-family-caption text-text-disabled truncate">
            📍 {alert.address}
          </p>
        )}

        {alert.assignedStaff && (
          <p className="mt-1 font-family-caption text-text-secondary">
            👨‍⚕️ {alert.assignedStaff.name} · {alert.assignedStaff.role}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center pr-3">
        <svg className="w-5 h-5 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
