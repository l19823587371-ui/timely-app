"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 px-6",
        className
      )}
    >
      {/* Illustration area */}
      <div className="w-24 h-24 rounded-full bg-border flex items-center justify-center text-4xl text-text-disabled select-none">
        {icon || "📭"}
      </div>

      <p className="text-text-secondary text-sm text-center max-w-[240px]">
        {message || "暂无数据"}
      </p>

      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium
                     hover:bg-primary-dark active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
