"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HEALTH_STATUS_MAP } from "@/lib/constants";

export type StatusType = "normal" | "warning" | "danger";

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "px-2 py-0.5 text-xs rounded",
  md: "px-2.5 py-1 text-sm rounded-md",
  lg: "px-3 py-1.5 text-base rounded-lg",
};

export default function StatusBadge({
  status,
  label,
  size = "md",
  className,
}: StatusBadgeProps) {
  const statusInfo = HEALTH_STATUS_MAP[status];
  const displayLabel = label ?? statusInfo?.label ?? status;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-medium whitespace-nowrap",
        sizeClasses[size],
        className
      )}
      style={{
        color: statusInfo?.color ?? "#333",
        backgroundColor: `${statusInfo?.color ?? "#333"}15`,
      }}
    >
      <span className="leading-none text-sm select-none">
        {statusInfo?.icon ?? "•"}
      </span>
      {displayLabel}
    </span>
  );
}
