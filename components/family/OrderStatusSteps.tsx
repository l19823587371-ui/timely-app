"use client";

import type { ServiceOrder } from "@/types/service";

interface OrderStatusStepsProps {
  order: ServiceOrder;
}

const stepSequence = [
  { key: "created", label: "已下单" },
  { key: "accepted", label: "已接单" },
  { key: "inProgress", label: "服务中" },
  { key: "completed", label: "已完成" },
];

const statusIndex: Record<string, number> = {
  pending: 0,
  accepted: 1,
  inProgress: 2,
  completed: 3,
  cancelled: -1,
};

export default function OrderStatusSteps({ order }: OrderStatusStepsProps) {
  const currentIdx = statusIndex[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";
  const timelineMap = new Map(order.timeline.map((t) => [t.status, t]));

  return (
    <div className="bg-card rounded-family p-4">
      <h3 className="font-family-h2 text-text-primary mb-4">订单进度</h3>

      {isCancelled ? (
        <div className="text-center py-4">
          <span className="text-4xl">❌</span>
          <p className="mt-2 font-family-body text-text-disabled">订单已取消</p>
        </div>
      ) : (
        <div className="relative">
          {stepSequence.map((step, idx) => {
            const timelineEntry = timelineMap.get(step.key);
            const isDone = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const isFuture = idx > currentIdx;

            let circleColor = "bg-gray-200 border-gray-300";
            let lineColor = "bg-gray-200";
            let textColor = "text-text-disabled";
            let icon = null;

            if (isDone && idx < currentIdx) {
              circleColor = "bg-success border-success";
              lineColor = "bg-success";
              textColor = "text-success";
              icon = (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              );
            } else if (isCurrent) {
              circleColor = "bg-primary border-primary";
              lineColor = "bg-primary";
              textColor = "text-primary";
              icon = (
                <div className="w-3 h-3 rounded-full bg-white" />
              );
            }

            return (
              <div key={step.key} className="flex items-start gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${circleColor}`}>
                    {icon}
                  </div>
                  {idx < stepSequence.length - 1 && (
                    <div className={`w-0.5 h-10 ${idx < currentIdx ? lineColor : "bg-gray-200"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <span className={`font-family-body font-semibold ${textColor}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-bg-warm text-primary font-family-caption">
                        进行中
                      </span>
                    )}
                  </div>
                  {timelineEntry && (
                    <span className="font-family-caption text-text-disabled">{timelineEntry.time}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
