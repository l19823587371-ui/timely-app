import type { Announcement } from "@/types/announcement";

export const mockAnnouncements: Announcement[] = [
  { id: "ANN001", title: "关于夏季老年防暑注意事项的通知", content: "各位居民：夏季高温天气，请注意防暑降温...", category: "community", publishedAt: "2026-06-08T10:00:00+08:00", readBy: ["S010"] },
  { id: "ANN002", title: "6月社区体检安排", content: "定于6月15日在社区医院进行免费体检...", category: "schedule", publishedAt: "2026-06-05T09:00:00+08:00", readBy: ["S010", "S011"] },
  { id: "ANN003", title: "系统升级通知", content: "系统将于6月12日凌晨2:00-4:00进行升级维护...", category: "system", publishedAt: "2026-06-09T08:00:00+08:00", readBy: [] },
];
