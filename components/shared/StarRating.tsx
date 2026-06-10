"use client";

import React, { useState, useCallback } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg" | number;
  className?: string;
}

function getStarSize(s: StarRatingProps["size"]): number {
  if (typeof s === "number") return s;
  switch (s) {
    case "sm": return 24;
    case "lg": return 40;
    default: return 32;
  }
}

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const starSize = getStarSize(size);
  const clampedValue = Math.max(0, Math.min(5, value ?? 0));
  const [hoverIdx, setHoverIdx] = useState<number>(-1);

  const handleClick = useCallback(
    (idx: number) => {
      if (readonly || !onChange) return;
      // Toggle: clicking the same star clears rating
      onChange(clampedValue === idx ? 0 : idx);
    },
    [readonly, onChange, clampedValue]
  );

  const stars = [1, 2, 3, 4, 5];
  const displayValue = hoverIdx > 0 ? hoverIdx : clampedValue;

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setHoverIdx(-1)}
    >
      {stars.map((idx) => {
        const filled = idx <= displayValue;
        return (
          <button
            key={idx}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(idx)}
            onMouseEnter={() => {
              if (!readonly) setHoverIdx(idx);
            }}
            className={cn(
              "p-0.5 transition-transform",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            aria-label={`${idx}星`}
          >
            <Star
              size={starSize}
              fill={filled ? "#FAAD14" : "#E5E5E5"}
              stroke={filled ? "#FAAD14" : "#E5E5E5"}
              strokeWidth={1.5}
              className="transition-colors duration-150"
            />
          </button>
        );
      })}
    </div>
  );
}
