import type { MonitoringAlert } from "@/types/monitoring";

export const mockMonitoringAlerts: MonitoringAlert[] = [
  { id: "MON001", elderId: "E003", elderName: "王奶奶", type: "fall", severity: "high", detectedAt: "2026-06-09T06:45:00+08:00", value: "跌倒检测触发，持续静止 3 分钟", duration: "3 分钟", community: "绿叶社区", acknowledged: false, handled: false },
  { id: "MON002", elderId: "E002", elderName: "李大爷", type: "bloodPressure", severity: "medium", detectedAt: "2026-06-09T08:30:00+08:00", value: "血压 158/95 mmHg，偏高", community: "阳光社区", acknowledged: true, handled: false },
  { id: "MON003", elderId: "E001", elderName: "张桂芳", type: "heartRate", severity: "medium", detectedAt: "2026-06-09T07:00:00+08:00", value: "心率 105 BPM，偏高", community: "阳光社区", acknowledged: true, handled: true },
  { id: "MON004", elderId: "E003", elderName: "王奶奶", type: "stillness", severity: "high", detectedAt: "2026-06-09T09:15:00+08:00", value: "静止超过 2 小时未检测到活动", duration: "2 小时", community: "绿叶社区", acknowledged: false, handled: false },
];
