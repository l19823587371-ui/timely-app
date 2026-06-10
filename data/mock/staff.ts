import type { Staff } from "@/types/medical";

export const mockStaff: Staff[] = [
  { id: "S010", name: "刘医生", role: "社区医生", department: "全科", phone: "137****4321", avatar: "/images/staff_001.png", community: "阳光社区" },
  { id: "S011", name: "王护士", role: "护士", department: "护理部", phone: "136****5432", avatar: "/images/staff_002.png", community: "阳光社区" },
  { id: "S012", name: "赵主任", role: "管理员", department: "管理部", phone: "135****6543", avatar: "/images/staff_003.png", community: "全部" },
];
