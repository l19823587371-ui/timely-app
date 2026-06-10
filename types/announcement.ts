export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "system" | "community" | "schedule";
  publishedAt: string;
  readBy: string[];
}
