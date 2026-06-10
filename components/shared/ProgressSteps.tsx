"use client";

import React from "react";
import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressStep {
  label: string;
  time?: string | null;
  done: boolean;
  current?: boolean;
}

export interface ProgressStepsProps {
  steps: ProgressStep[];
  direction?: "vertical" | "horizontal";
  className?: string;
}

export default function ProgressSteps({
  steps,
  direction = "vertical",
  className,
}: ProgressStepsProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-text-disabled text-sm py-4 text-center">
        暂无步骤
      </div>
    );
  }

  const isVertical = direction === "vertical";

  return (
    <div
      className={cn(
        isVertical ? "flex flex-col" : "flex items-start",
        className
      )}
    >
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const stateClass = step.done
          ? "bg-success border-success text-white" // done
          : step.current
          ? "bg-primary border-primary text-white animate-pulse" // current
          : "bg-card border-border text-text-disabled"; // future

        return (
          <div
            key={idx}
            className={cn(
              "flex",
              isVertical
                ? "flex-row items-start gap-3"
                : "flex-col items-center flex-1 min-w-[72px]"
            )}
          >
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                  stateClass,
                  // Touch-friendly: minimum 44px target
                  "min-w-[44px] min-h-[44px]"
                )}
              >
                {step.done ? (
                  <Check size={16} strokeWidth={3} />
                ) : step.current ? (
                  <Clock size={16} strokeWidth={2.5} />
                ) : (
                  <span className="text-xs font-bold">{idx + 1}</span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    isVertical ? "w-0.5 h-8 my-1" : "h-0.5 w-full mt-2",
                    step.done ? "bg-success" : step.current ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div
              className={cn(
                isVertical ? "pt-1" : "text-center mt-2",
                "min-w-0" // allow text truncation
              )}
            >
              <p
                className={cn(
                  "text-sm leading-tight font-medium",
                  step.current
                    ? "text-primary"
                    : step.done
                    ? "text-text-primary"
                    : "text-text-disabled"
                )}
              >
                {step.label}
              </p>
              {step.time ? (
                <p className="text-xs text-text-disabled mt-0.5">
                  {step.time}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
