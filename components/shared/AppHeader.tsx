"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  variant?: "elder" | "family" | "medical";
}

const variantStyles: Record<
  NonNullable<AppHeaderProps["variant"]>,
  { height: string; font: string; px: string; iconSize: number }
> = {
  elder: { height: "h-[56px] min-h-[56px]", font: "text-elder-h2", px: "px-elder-px", iconSize: 28 },
  family: { height: "h-12 min-h-[48px]", font: "text-family-h2", px: "px-family-px", iconSize: 24 },
  medical: { height: "h-10 min-h-[40px]", font: "text-medical-h2", px: "px-medical-px", iconSize: 20 },
};

export default function AppHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
  variant = "elder",
}: AppHeaderProps) {
  const vs = variantStyles[variant];
  const titleClass = cn(
    "font-bold text-text-primary truncate max-w-[60%]",
    vs.font
  );

  return (
    <header
      className={cn(
        "flex items-center justify-between w-full bg-white border-b border-border shrink-0",
        vs.height,
        vs.px
      )}
    >
      {/* Left: back button or spacer */}
      <div className="flex items-center min-w-[40px]">
        {showBack ? (
          <button
            onClick={onBack}
            aria-label="返回"
            className="flex items-center justify-center -ml-2 rounded-full hover:bg-black/5 transition-colors"
            style={{ width: vs.iconSize + 16, height: vs.iconSize + 16 }}
          >
            <ChevronLeft size={vs.iconSize} className="text-text-primary" />
          </button>
        ) : null}
      </div>

      {/* Center: title */}
      <h1 className={titleClass}>{title || "及时APP"}</h1>

      {/* Right: action or spacer */}
      <div className="flex items-center min-w-[40px] justify-end">
        {rightAction || null}
      </div>
    </header>
  );
}
