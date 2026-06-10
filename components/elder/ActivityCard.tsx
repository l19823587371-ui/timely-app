"use client";
import { cn } from "@/lib/utils";
import { Users, MapPin, Clock, Dumbbell, BookOpen, Heart, Palette, Music } from "lucide-react";
import type { Activity } from "@/types/activity";

interface ActivityCardProps {
  activity: Activity;
  onRegister?: (id: string) => void;
  className?: string;
}

const categoryIcons: Record<string, React.ElementType> = {
  "运动": Dumbbell,
  "学习": BookOpen,
  "健康": Heart,
  "文化": Palette,
  "娱乐": Music,
};

export default function ActivityCard({ activity, onRegister, className }: ActivityCardProps) {
  const Icon = categoryIcons[activity.category] || Dumbbell;
  const isRegistered = activity.registeredElderly.includes("E001");
  const isFull = activity.currentParticipants >= activity.maxParticipants && activity.maxParticipants > 0;
  const noLimit = activity.maxParticipants === 0;

  return (
    <div className={cn("bg-card rounded-elder p-elder-px", className)}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon size={28} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-elder-h2 text-text-primary">{activity.name}</h4>
          <div className="flex items-center gap-1 mt-2 text-text-secondary">
            <Clock size={16} />
            <span className="text-elder-caption">{activity.schedule}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-text-secondary">
            <MapPin size={16} />
            <span className="text-elder-caption">{activity.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-text-secondary">
            <Users size={16} />
            <span className="text-elder-caption">
              {noLimit ? "不限人数" : `${activity.currentParticipants}/${activity.maxParticipants} 人`}
            </span>
          </div>
        </div>
        <button
          onClick={() => onRegister?.(activity.id)}
          disabled={isFull || isRegistered || !onRegister}
          className={cn(
            "min-h-[44px] px-6 rounded-elder text-elder-caption font-bold flex-shrink-0 self-center transition-colors",
            isRegistered
              ? "bg-primary/10 text-primary"
              : isFull
                ? "bg-text-disabled/20 text-text-disabled cursor-not-allowed"
                : "border-2 border-primary text-primary hover:bg-primary/5 active:scale-95"
          )}
        >
          {isRegistered ? "已报名" : isFull ? "已满员" : "报名"}
        </button>
      </div>
    </div>
  );
}
