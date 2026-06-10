"use client";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared";
import type { HealthStatus } from "@/types/health";
import type { LucideIcon } from "lucide-react";

interface HealthMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  status: HealthStatus;
  onClick?: () => void;
  className?: string;
}

const trendArrows: Record<HealthStatus, { arrow: string; color: string }> = {
  normal: { arrow: "→", color: "text-success" },
  warning: { arrow: "↗", color: "text-warning" },
  danger: { arrow: "↑", color: "text-danger" },
};

export default function HealthMetricCard({ icon: Icon, label, value, unit, status, onClick, className }: HealthMetricCardProps) {
  const arrowConfig = trendArrows[status];

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "bg-card rounded-elder p-elder-px text-left transition-colors",
        "hover:bg-background active:scale-[0.98]",
        "flex flex-col gap-3 min-h-[140px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
          <span className="text-elder-caption text-text-secondary">{label}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-[32px] font-bold text-text-primary">{value}</span>
        {unit && <span className="text-elder-caption text-text-disabled">{unit}</span>}
      </div>
      <span className={cn("text-elder-caption", arrowConfig.color)}>{arrowConfig.arrow} 趋势</span>
    </button>
  );
}
