"use client";

import type { BindingElder } from "@/types/family";

interface FamilyMemberCardProps {
  elder: BindingElder;
  selected?: boolean;
  onSelect: () => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  normal: { label: "健康", color: "text-success", bg: "bg-green-50", dot: "bg-success" },
  warning: { label: "注意", color: "text-warning", bg: "bg-yellow-50", dot: "bg-warning" },
  danger: { label: "异常", color: "text-danger", bg: "bg-red-50", dot: "bg-danger" },
};

export default function FamilyMemberCard({ elder, selected, onSelect }: FamilyMemberCardProps) {
  const status = statusConfig[elder.healthStatus] || statusConfig.normal;

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 p-3 rounded-family cursor-pointer transition-all active:scale-[0.98] ${
        selected
          ? "bg-primary/10 border-2 border-primary shadow-sm"
          : "bg-card border-2 border-transparent hover:bg-bg-warm"
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-bg-warm flex items-center justify-center overflow-hidden">
          {elder.avatar ? (
            <img src={elder.avatar} alt={elder.elderName} className="w-full h-full object-cover" />
          ) : (
            <span className="font-family-h2 text-text-disabled">{elder.elderName[0]}</span>
          )}
        </div>
        {/* Health status dot */}
        <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${status.dot}`} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-family-h2 text-text-primary truncate">{elder.elderName}</span>
          <span className="font-family-caption text-text-disabled">{elder.age}岁</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="font-family-caption text-text-secondary">{elder.relation}</span>
          <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
