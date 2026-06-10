"use client";
import { cn } from "@/lib/utils";

interface LargeButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

const variantClasses: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primary-dark active:scale-[0.98]",
  secondary: "bg-card text-primary border-2 border-primary hover:bg-primary/5 active:scale-[0.98]",
  danger: "bg-danger text-white hover:bg-danger/90 active:scale-[0.98]",
  ghost: "bg-transparent text-text-secondary hover:bg-border/30 active:scale-[0.98]",
};

export default function LargeButton({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className,
  type = "button",
}: LargeButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-elder-btn rounded-[12px] text-elder-btn px-8 transition-colors shadow-sm inline-flex items-center justify-center",
        variantClasses[variant],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
