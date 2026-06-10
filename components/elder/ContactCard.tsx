"use client";
import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import type { EmergencyContact } from "@/types/elder";

interface ContactCardProps {
  contact: EmergencyContact;
  onCall?: (contact: EmergencyContact) => void;
  className?: string;
}

const levelConfig: Record<number, { border: string; bg: string; label: string }> = {
  1: { border: "border-l-4 border-danger", bg: "bg-bg-alert", label: "紧急" },
  2: { border: "border-l-4 border-primary", bg: "bg-bg-warm", label: "主要" },
  3: { border: "border-l-4 border-warning", bg: "bg-card", label: "备用" },
};

export default function ContactCard({ contact, onCall, className }: ContactCardProps) {
  const config = levelConfig[contact.level] || levelConfig[3];
  const maskedPhone = contact.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

  return (
    <div className={cn("rounded-elder overflow-hidden", config.border, className)}>
      <div className={cn("p-elder-px flex items-center gap-4", config.bg)}>
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-elder-h1 text-primary">{contact.name[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-elder-h2 text-text-primary">{contact.name}</h4>
            <span className={cn(
              "text-elder-caption px-2 py-0.5 rounded-full",
              contact.level === 1 ? "bg-danger/10 text-danger" :
              contact.level === 2 ? "bg-primary/10 text-primary" :
              "bg-warning/10 text-warning"
            )}>
              {config.label}
            </span>
          </div>
          <p className="text-elder-caption text-text-secondary mt-1">{contact.relation}</p>
          <p className="text-elder-caption text-text-disabled mt-1">{maskedPhone}</p>
        </div>
        <button
          onClick={() => onCall?.(contact)}
          disabled={!onCall}
          className={cn(
            "min-w-elder-touch min-h-elder-btn rounded-full flex items-center justify-center transition-colors flex-shrink-0",
            contact.level === 1
              ? "bg-danger text-white hover:bg-danger/90 active:scale-95"
              : "bg-primary text-white hover:bg-primary-dark active:scale-95"
          )}
        >
          <Phone size={28} />
        </button>
      </div>
    </div>
  );
}
