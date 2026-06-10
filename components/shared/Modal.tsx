"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  className,
}: ModalProps) {
  // Prevent background scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || "对话框"}
    >
      {/* Overlay — blocks click-through */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className={cn(
          "relative bg-card rounded-dialog shadow-xl max-w-[90vw] max-h-[85vh] overflow-auto",
          "w-full sm:max-w-md mx-4",
          className
        )}
      >
        {/* Close button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            aria-label="关闭"
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                       rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-2">
            {title && (
              <h2 className="text-lg font-bold text-text-primary pr-8">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-text-secondary mt-1">{description}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
