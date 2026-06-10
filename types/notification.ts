export type NotificationCategory = "system" | "activity" | "health" | "alert";
export type NotificationType = "emergency" | "activity_reminder" | "medication" | "health_warning" | "system";

export interface Notification {
  id: string;
  targetId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  content: string;
  publishedAt: string;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
  icon: string;
}
