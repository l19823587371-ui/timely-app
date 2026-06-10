import type { Activity } from "@/types/activity";

export const mockActivities: Activity[] = [
  { id: "A001", name: "太极拳晨练", category: "运动", schedule: "每周一三五 07:00", location: "社区广场", maxParticipants: 30, currentParticipants: 18, instructor: "陈师傅", image: "/images/activity_taiji.png", status: "upcoming", registeredElderly: ["E001"] },
  { id: "A002", name: "智能手机培训", category: "学习", schedule: "每周二 14:00", location: "活动室", maxParticipants: 20, currentParticipants: 12, instructor: "小周老师", image: "/images/activity_phone.png", status: "upcoming", registeredElderly: [] },
  { id: "A003", name: "免费健康体检", category: "健康", schedule: "6月15日 08:00", location: "社区医院", maxParticipants: 50, currentParticipants: 25, instructor: "社区医生", image: "/images/activity_health.png", status: "upcoming", registeredElderly: ["E001"] },
  { id: "A004", name: "书法兴趣班", category: "文化", schedule: "每周四 09:00", location: "书画室", maxParticipants: 15, currentParticipants: 8, instructor: "王老师", image: "/images/activity_culture.png", status: "upcoming", registeredElderly: [] },
  { id: "A005", name: "乐器演奏会", category: "文化", schedule: "每周六 15:00", location: "多功能厅", maxParticipants: 20, currentParticipants: 10, instructor: "李老师", image: "/images/activity_music.png", status: "upcoming", registeredElderly: [] },
  { id: "A006", name: "合唱团排练", category: "娱乐", schedule: "每周日 09:00", location: "活动室", maxParticipants: 25, currentParticipants: 15, instructor: "张指挥", image: "/images/activity_chorus.png", status: "upcoming", registeredElderly: [] },
  { id: "A007", name: "广场舞", category: "运动", schedule: "每晚 19:00", location: "社区广场", maxParticipants: 0, currentParticipants: 0, instructor: "自发组织", image: "/images/activity_dance.png", status: "upcoming", registeredElderly: [] },
];
