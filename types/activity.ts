export interface Activity {
  id: string;
  name: string;
  category: "运动" | "学习" | "健康" | "文化" | "娱乐";
  schedule: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  instructor: string;
  image: string;
  status: "upcoming" | "ongoing" | "finished" | "cancelled";
  registeredElderly: string[];
}
