"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
}

export interface MapViewProps {
  markers?: MapMarker[];
  height?: number;
  className?: string;
}

export default function MapView({
  markers,
  height = 200,
  className,
}: MapViewProps) {
  const hasMarkers = markers && markers.length > 0;

  return (
    <div
      className={cn(
        "relative w-full rounded-xl overflow-hidden bg-[#e8e4df] select-none",
        className
      )}
      style={{ height }}
    >
      {/* Grid lines for map feel */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Pins */}
      {hasMarkers ? (
        markers.map((m, idx) => {
          // Pseudo-position pins based on lat/lng relative to bounds
          const left = ((m.lng + 180) / 360) * 100;
          const top = ((90 - m.lat) / 180) * 100;
          return (
            <div
              key={idx}
              className="absolute flex flex-col items-center"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <MapPin
                size={28}
                className="text-primary drop-shadow-md"
                fill="#F28C28"
                stroke="#fff"
                strokeWidth={1.5}
              />
              {m.label ? (
                <span className="text-xs bg-white/90 text-text-primary px-1.5 py-0.5 rounded shadow mt-0.5 whitespace-nowrap max-w-[120px] truncate">
                  {m.label}
                </span>
              ) : null}
            </div>
          );
        })
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <MapPin size={32} className="text-text-disabled" />
          <span className="text-sm text-text-disabled">暂无地图数据</span>
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
  );
}
