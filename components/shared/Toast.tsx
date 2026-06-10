"use client";

import React, { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} className="text-success shrink-0" />,
  error: <XCircle size={20} className="text-danger shrink-0" />,
  info: <Info size={20} className="text-primary shrink-0" />,
};

const bgMap: Record<ToastType, string> = {
  success: "bg-success/10 border-success/30",
  error: "bg-danger/10 border-danger/30",
  info: "bg-primary/10 border-primary/30",
};

export default function Toast({
  message,
  type = "info",
  visible,
  onClose,
  duration = 3000,
  className,
}: ToastProps) {
  // Auto-dismiss
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible || !message) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 z-[100] -translate-x-1/2",
        "flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border",
        "animate-in slide-in-from-bottom-4 fade-in duration-300",
        "max-w-[calc(100vw-32px)]",
        bgMap[type],
        className
      )}
      role="alert"
    >
      {iconMap[type]}

      <span className="text-sm font-medium text-text-primary flex-1 min-w-0 break-words">
        {message}
      </span>

      <button
        onClick={onClose}
        aria-label="关闭"
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5"
      >
        <X size={14} className="text-text-secondary" />
      </button>
    </div>
  );
}
