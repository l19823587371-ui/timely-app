"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Heart,
  Calendar,
  User,
  Briefcase,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabBarItem {
  label: string;
  path: string;
  icon: string;
}

export interface TabBarProps {
  items: TabBarItem[];
  currentPath: string;
  hasNotification?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  Heart,
  Calendar,
  User,
  Briefcase,
  Bell,
};

export default function TabBar({
  items,
  currentPath,
  hasNotification = false,
}: TabBarProps) {
  const router = useRouter();

  if (!items || items.length === 0) {
    return (
      <nav className="h-16 flex items-center justify-center bg-white border-t border-border text-text-disabled text-sm">
        暂无导航
      </nav>
    );
  }

  return (
    <nav className="h-16 flex items-stretch bg-white border-t border-border shrink-0">
      {items.map((item) => {
        const isActive = currentPath === item.path || currentPath?.startsWith(item.path + "/");
        const Icon = iconMap[item.icon];
        const showBadge = hasNotification && item.label === "消息";

        return (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative",
              "min-w-0 min-h-0", // allow flex shrink
              isActive ? "text-primary" : "text-text-disabled"
            )}
          >
            <div className="relative">
              {Icon ? (
                <Icon
                  size={22}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-text-disabled"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              ) : (
                <span className="text-xs">?</span>
              )}
              {showBadge && (
                <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-danger rounded-full border border-white" />
              )}
            </div>
            <span
              className={cn(
                "text-xs leading-none",
                isActive ? "font-semibold" : "font-normal"
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
