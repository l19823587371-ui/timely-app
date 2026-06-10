"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

export default function LoadingSpinner({
  message,
  className,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          sizeMap[size]
        )}
      />
      {message ? (
        <p className="text-text-secondary text-sm">{message}</p>
      ) : null}
    </div>
  );
}
