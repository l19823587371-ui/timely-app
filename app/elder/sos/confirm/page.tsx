"use client";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { CountdownRing } from "@/components/shared";

export default function SOSConfirmPage() {
  const router = useRouter();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startRef = useRef<number>(0);
  const thresholdMs = 1000;
  const cancelZoneRef = useRef<HTMLDivElement>(null);

  const startHold = useCallback(() => {
    setHolding(true);
    setProgress(0);
    startRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min(elapsed / thresholdMs, 1);
      setProgress(pct);

      if (elapsed >= thresholdMs) {
        clearInterval(timerRef.current!);
        router.push("/elder/sos/countdown");
      }
    }, 50);
  }, [router]);

  const endHold = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
    setProgress(0);
  }, []);

  const handlePointerDown = () => startHold();
  const handlePointerUp = () => endHold();
  const handlePointerLeave = () => endHold();

  const handleDragToCancel = (e: React.PointerEvent) => {
    if (!cancelZoneRef.current || !holding) return;
    const rect = cancelZoneRef.current.getBoundingClientRect();
    if (
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom
    ) {
      endHold();
      router.push("/elder/sos/cancel");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center"
      style={{ background: "rgba(255, 77, 79, 0.15)" }}
      onPointerMove={handleDragToCancel}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Countdown Ring */}
        <CountdownRing
          progress={progress}
          size={200}
          strokeWidth={10}
        >
          <span className="text-[72px] font-bold text-danger">
            {Math.ceil((1 - progress) * 100) / 100 || "1"}
          </span>
        </CountdownRing>

        {holding && (
          <p className="text-elder-h2 text-danger font-medium">按住不放...</p>
        )}
        {!holding && (
          <p className="text-elder-body text-text-secondary">请长按屏幕任意位置</p>
        )}
      </div>

      {/* Cancel Zone */}
      <div
        ref={cancelZoneRef}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-black/50 text-white px-12 py-4 rounded-full text-elder-body"
      >
        拖到此处取消
      </div>
    </div>
  );
}
