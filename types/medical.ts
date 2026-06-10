export interface Staff {
  id: string;
  name: string;
  role: "社区医生" | "护士" | "管理员";
  department: string;
  phone: string;
  avatar: string;
  community: string;
}

export interface Consultation {
  id: string;
  elderId: string;
  staffId: string;
  type: "voice" | "video";
  startTime: string;
  endTime?: string;
  duration?: number;
  reason: string;
  notes?: string;
  recordingUrl?: string;
}
