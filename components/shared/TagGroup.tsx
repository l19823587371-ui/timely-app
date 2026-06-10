"use client";

import React, { useCallback } from "react";
import { cn } from "@/lib/utils";

export interface TagGroupProps {
  tags: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
  color?: string;
  className?: string;
}

export default function TagGroup({
  tags,
  selected,
  onChange,
  maxSelect,
  color = "#F28C28",
  className,
}: TagGroupProps) {
  const handleToggle = useCallback(
    (tag: string) => {
      const isSelected = selected.includes(tag);
      if (isSelected) {
        onChange(selected.filter((t) => t !== tag));
      } else {
        if (maxSelect && selected.length >= maxSelect) {
          return; // at max, do nothing
        }
        onChange([...selected, tag]);
      }
    },
    [selected, onChange, maxSelect]
  );

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => {
        const isActive = selected.includes(tag);
        const atMax =
          maxSelect !== undefined &&
          selected.length >= maxSelect &&
          !isActive;

        return (
          <button
            key={tag}
            type="button"
            onClick={() => handleToggle(tag)}
            disabled={atMax}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[40px] min-w-[44px]",
              "border",
              isActive
                ? "text-white border-transparent"
                : "text-text-secondary border-border bg-white hover:border-text-disabled",
              atMax && "opacity-40 cursor-not-allowed"
            )}
            style={
              isActive
                ? { backgroundColor: color, borderColor: color }
                : undefined
            }
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
