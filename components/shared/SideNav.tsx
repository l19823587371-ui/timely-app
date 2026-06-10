"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Heart,
  Activity,
  AlertTriangle,
  Megaphone,
  Settings,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SideNavItem {
  label: string;
  path: string;
  icon: string;
}

export interface SideNavProps {
  items: SideNavItem[];
  currentPath: string;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Heart,
  Activity,
  AlertTriangle,
  Megaphone,
  Settings,
  ClipboardList,
};

export default function SideNav({ items, currentPath }: SideNavProps) {
  const router = useRouter();

  if (!items || items.length === 0) {
    return (
      <aside className="w-[220px] min-w-[220px] h-full bg-card border-r border-border flex items-center justify-center">
        <span className="text-text-disabled text-sm">无导航项</span>
      </aside>
    );
  }

  return (
    <aside className="w-[220px] min-w-[220px] h-full bg-card border-r border-border flex flex-col shrink-0">
      <div className="flex-1 py-4 overflow-y-auto">
        {items.map((item) => {
          const isActive =
            currentPath === item.path ||
            currentPath?.startsWith(item.path + "/");
          const Icon = iconMap[item.icon];

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                "flex items-center gap-3 w-full px-5 py-3 text-left transition-colors relative",
                "text-sm font-medium border-l-[3px]",
                isActive
                  ? "text-primary bg-primary/10 border-l-primary"
                  : "text-text-secondary border-l-transparent hover:bg-black/3 hover:text-text-primary"
              )}
            >
              {Icon ? (
                <Icon
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-primary" : "text-text-secondary"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              ) : (
                <span className="w-5 h-5 shrink-0" />
              )}
              <span
                className={cn(
                  "truncate",
                  isActive ? "font-semibold" : "font-normal"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
