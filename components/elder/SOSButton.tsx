"use client";
import { cn } from "@/lib/utils";
import { useLongPress } from "@/hooks/useLongPress";
import "./SOSButton.css";

interface SOSButtonProps {
  size?: "sm" | "lg";
  onLongPress: () => void;
  disabled?: boolean;
}

export default function SOSButton({ size = "sm", onLongPress, disabled = false }: SOSButtonProps) {
  const diameter = size === "sm" ? 160 : 180;

  const { onPointerDown, onPointerUp, onPointerLeave } = useLongPress({
    threshold: 1000,
    onTrigger: onLongPress,
  });

  return (
    <div className="flex justify-center">
      <button
        className={cn(
          "sos-button relative rounded-full flex flex-col items-center justify-center text-white font-bold shadow-lg select-none",
          "active:scale-95 transition-transform duration-150",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ width: diameter, height: diameter }}
        onPointerDown={disabled ? undefined : onPointerDown}
        onPointerUp={disabled ? undefined : onPointerUp}
        onPointerLeave={disabled ? undefined : onPointerLeave}
        disabled={disabled}
      >
        {/* Pulse ring */}
        <div className="sos-pulse absolute inset-0 rounded-full" />
        <span className="text-[48px] leading-none tracking-widest relative z-10" style={{ fontSize: diameter * 0.28 }}>
          SOS
        </span>
        <span className="text-elder-caption mt-1 relative z-10 opacity-90">紧急求助</span>
      </button>
    </div>
  );
}
