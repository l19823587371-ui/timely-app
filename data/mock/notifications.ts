import type { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [
  { id: "NOT001", targetId: "F001", type: "emergency", category: "alert", title: "紧急警报", content: "张桂芳发起 SOS 紧急求助", publishedAt: "2026-06-10T08:15:00+08:00", read: false, actionUrl: "/family/alert/current", relatedId: "SOS002", icon: "🔴" },
  { id: "NOT002", targetId: "F001", type: "activity_reminder", category: "activity", title: "活动提醒", content: "明天有太极拳晨练活动", publishedAt: "2026-06-09T06:30:00+08:00", read: true, actionUrl: "/family/activities/register", icon: "📅" },
  { id: "NOT003", targetId: "F001", type: "medication", category: "health", title: "用药提醒", content: "降压药需续方，请及时处理", publishedAt: "2026-06-08T14:00:00+08:00", read: true, actionUrl: "/family/health-report", icon: "💊" },
  { id: "NOT004", targetId: "F001", type: "health_warning", category: "health", title: "健康预警", content: "张桂芳血压偏高，请关注", publishedAt: "2026-06-09T09:00:00+08:00", read: true, actionUrl: "/family", icon: "🩺" },
  { id: "NOT005", targetId: "F001", type: "system", category: "system", title: "系统通知", content: "社区体检报名已开始", publishedAt: "2026-06-07T10:00:00+08:00", read: true, actionUrl: "/family/activities/register", icon: "📢" },
];
