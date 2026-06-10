"use client";
import { useCallback, useRef } from "react";

interface UseLongPressOptions {
  threshold?: number;
  onTrigger: () => void;
  onCancel?: () => void;
}

export function useLongPress({ threshold = 1000, onTrigger, onCancel }: UseLongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredRef = useRef(false);

  const onPointerDown = useCallback(() => {
    triggeredRef.current = false;
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      onTrigger();
    }, threshold);
  }, [threshold, onTrigger]);

  const onPointerUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!triggeredRef.current) {
      onCancel?.();
    }
  }, [onCancel]);

  const onPointerLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return { onPointerDown, onPointerUp, onPointerLeave };
}
