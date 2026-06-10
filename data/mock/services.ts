import type { ServiceOrder } from "@/types/service";

export const mockServiceOrders: ServiceOrder[] = [
  {
    id: "ORD001", familyId: "F001", elderId: "E001", elderName: "张桂芳",
    serviceType: "escort", status: "inProgress",
    scheduledTime: "2026-06-10T09:00:00+08:00",
    address: "北京市朝阳区阳光社区 3 号楼 201 室",
    notes: "需要陪同去朝阳医院心内科复查", price: 150,
    provider: { id: "P010", name: "赵护工", phone: "137****4321", rating: 4.8, avatar: "/images/provider_001.png" },
    timeline: [
      { status: "created", label: "已下单", time: "06-09 14:00" },
      { status: "accepted", label: "已接单", time: "06-09 14:05" },
    ],
  },
  {
    id: "ORD002", familyId: "F001", elderId: "E001", elderName: "张桂芳",
    serviceType: "cleaning", status: "completed",
    scheduledTime: "2026-06-05T10:00:00+08:00",
    address: "北京市朝阳区阳光社区 3 号楼 201 室",
    notes: "日常保洁，重点打扫厨房", price: 120,
    provider: { id: "P011", name: "周阿姨", phone: "136****5432", rating: 4.5, avatar: "/images/provider_002.png" },
    timeline: [
      { status: "created", label: "已下单", time: "06-04 09:00" },
      { status: "accepted", label: "已接单", time: "06-04 09:15" },
      { status: "inProgress", label: "服务中", time: "06-05 10:00" },
      { status: "completed", label: "已完成", time: "06-05 15:30" },
    ],
    review: { stars: 4, tags: ["很细心", "态度好"], comment: "打扫得很干净", images: [], createdAt: "2026-06-05T16:00:00+08:00" },
  },
  {
    id: "ORD003", familyId: "F002", elderId: "E002", elderName: "李大爷",
    serviceType: "haircut", status: "pending",
    scheduledTime: "2026-06-12T14:00:00+08:00",
    address: "北京市朝阳区阳光社区 5 号楼 102 室",
    notes: "上门理发，老人行动不便", price: 60,
    provider: { id: "P012", name: "小陈", phone: "135****7654", rating: 4.9, avatar: "/images/provider_003.png" },
    timeline: [{ status: "created", label: "已下单", time: "06-09 10:00" }],
  },
];
