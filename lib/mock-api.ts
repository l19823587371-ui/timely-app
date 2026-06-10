import { mockElders, mockFamilies, mockStaff, mockSOSAlerts, mockHealthRecords, mockActivities, mockServiceOrders, mockNotifications, mockAnnouncements, mockMonitoringAlerts } from "@/data/mock";
import { mockDelay } from "./mock";
import type { Elder, EmergencyContact } from "@/types/elder";
import type { FamilyMember, BindingElder } from "@/types/family";
import type { SOSAlert, SOSRating } from "@/types/sos";
import type { HealthRecord, WeeklyReport } from "@/types/health";
import type { Activity } from "@/types/activity";
import type { ServiceOrder, ServiceReview } from "@/types/service";
import type { Notification } from "@/types/notification";
import type { Announcement } from "@/types/announcement";
import type { MonitoringAlert } from "@/types/monitoring";

// Mutable copies
let elders = JSON.parse(JSON.stringify(mockElders));
let sosAlerts = JSON.parse(JSON.stringify(mockSOSAlerts));
let serviceOrders = JSON.parse(JSON.stringify(mockServiceOrders));
let monitoringAlerts = JSON.parse(JSON.stringify(mockMonitoringAlerts));
let notifications = JSON.parse(JSON.stringify(mockNotifications));
let announcements = JSON.parse(JSON.stringify(mockAnnouncements));

// === ELDER ===
export async function getElderProfile(): Promise<Elder> {
  await mockDelay();
  return elders[0];
}

export async function getElderContacts(): Promise<EmergencyContact[]> {
  await mockDelay();
  return elders[0].emergencyContacts;
}

export async function getElderLocation(): Promise<{ lat: number; lng: number; address: string }> {
  await mockDelay(100);
  return { lat: 39.9219, lng: 116.4435, address: elders[0].address };
}

// === SOS ===
export async function triggerSOS(elderId: string, location: { lat: number; lng: number }): Promise<{ alertId: string }> {
  await mockDelay();
  const id = `SOS${Date.now()}`;
  const elder = elders.find((e: typeof elders[number]) => e.id === elderId)!;
  const alert: SOSAlert = {
    id, elderId, elderName: elder.name, elderAge: elder.age,
    type: "emergency", status: "pending",
    triggerTime: new Date().toISOString(),
    location, address: elder.address,
    rescueProgress: [
      { step: "alerted", label: "已报警", time: new Date().toLocaleTimeString("zh-CN", { hour12: false }), done: true },
      { step: "accepted", label: "已接单", time: null, done: false },
      { step: "rescuing", label: "救援中", time: null, done: false },
      { step: "arrived", label: "已到达", time: null, done: false },
      { step: "completed", label: "已完成", time: null, done: false },
    ],
    familyNotified: false, familyAccepted: false,
  };
  sosAlerts.unshift(alert);
  return { alertId: id };
}

export async function getSOSAlert(id: string): Promise<SOSAlert | null> {
  await mockDelay();
  return sosAlerts.find((a: typeof sosAlerts[number]) => a.id === id) || null;
}

export async function getSOSProgress(id: string): Promise<{ steps: SOSAlert["rescueProgress"]; status: string }> {
  await mockDelay(200);
  const alert = sosAlerts.find((a: typeof sosAlerts[number]) => a.id === id);
  if (!alert) throw new Error("SOS not found");
  return { steps: alert.rescueProgress, status: alert.status };
}

export async function getSOSQueue(): Promise<{ emergencies: SOSAlert[]; subEmergencies: SOSAlert[]; normals: SOSAlert[] }> {
  await mockDelay();
  const pending = sosAlerts.filter((a: typeof sosAlerts[number]) => a.status === "pending");
  return {
    emergencies: pending.filter((a: typeof sosAlerts[number]) => a.type === "emergency"),
    subEmergencies: pending.filter((a: typeof sosAlerts[number]) => a.type === "sub_emergency"),
    normals: pending.filter((a: typeof sosAlerts[number]) => a.type === "normal"),
  };
}

export async function acceptSOS(id: string, staffId: string): Promise<SOSAlert> {
  await mockDelay();
  const alert = sosAlerts.find((a: typeof sosAlerts[number]) => a.id === id)!;
  alert.status = "accepted";
  alert.rescueProgress[1].time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  alert.rescueProgress[1].done = true;
  alert.assignedStaff = { id: staffId, name: mockStaff.find(s => s.id === staffId)!.name, role: "社区医生" };
  return alert;
}

export async function updateSOSProgress(id: string, step: string, note: string): Promise<SOSAlert> {
  await mockDelay();
  const alert = sosAlerts.find((a: typeof sosAlerts[number]) => a.id === id)!;
  const stepIdx = alert.rescueProgress.findIndex((s: { step: string }) => s.step === step);
  if (stepIdx >= 0) {
    alert.rescueProgress[stepIdx].done = true;
    alert.rescueProgress[stepIdx].time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
    alert.rescueProgress[stepIdx].note = note;
  }
  if (step === "arrived") alert.status = "arrived";
  if (step === "completed") alert.status = "completed";
  return alert;
}

export async function cancelSOS(id: string): Promise<void> {
  await mockDelay();
  const alert = sosAlerts.find((a: typeof sosAlerts[number]) => a.id === id);
  if (alert) alert.status = "cancelled";
}

export async function submitSOSRating(id: string, rating: SOSRating): Promise<void> {
  await mockDelay();
  const alert = sosAlerts.find((a: typeof sosAlerts[number]) => a.id === id);
  if (alert) alert.rating = rating;
}

export async function getSOSHistory(elderId: string): Promise<SOSAlert[]> {
  await mockDelay();
  return sosAlerts.filter((a: typeof sosAlerts[number]) => a.elderId === elderId);
}

export async function getSOSVideo(id: string): Promise<{ videoUrl: string; events: Array<{ time: string; label: string }> }> {
  await mockDelay();
  return {
    videoUrl: "/recordings/sos_demo.mp4",
    events: [
      { time: "00:00", label: "SOS 触发" },
      { time: "00:35", label: "医护接单" },
      { time: "05:20", label: "救援到达" },
    ],
  };
}

// === HEALTH ===
export async function getLatestHealth(elderId: string): Promise<Partial<HealthRecord>> {
  await mockDelay();
  const records = mockHealthRecords.filter((r: typeof mockHealthRecords[number]) => r.elderId === elderId);
  return records[records.length - 1] || null;
}

export async function getHealthTrend(type: string, elderId: string, period: string): Promise<HealthRecord[]> {
  await mockDelay();
  let records = mockHealthRecords.filter((r: typeof mockHealthRecords[number]) => r.elderId === elderId);
  const days = period === "week" ? 7 : period === "month" ? 30 : 90;
  return records.slice(-days);
}

export async function getWeeklyReport(elderId: string): Promise<WeeklyReport> {
  await mockDelay();
  return {
    elderId, weekStart: "2026-06-03", weekEnd: "2026-06-09",
    score: 85, scoreChange: 3,
    bpTrend: "rising", hrTrend: "normal", spo2Trend: "normal", sleepTrend: "declining",
    anomalies: [
      { date: "06-07", type: "血压偏高", value: "148/92", severity: "warning" },
      { date: "06-05", type: "睡眠不足", value: "4.5h", severity: "warning" },
    ],
    suggestions: ["本周血压有上升趋势，建议减少盐分摄入", "保证每天 7 小时以上睡眠", "按时服用降压药"],
    medications: [
      { name: "硝苯地平缓释片", dosage: "30mg", frequency: "每日 1 次", missedThisWeek: 1, status: "warning" },
      { name: "二甲双胍", dosage: "500mg", frequency: "每日 2 次", missedThisWeek: 0, status: "normal" },
    ],
  };
}

// === ACTIVITIES ===
export async function getActivities(): Promise<Activity[]> {
  await mockDelay();
  return JSON.parse(JSON.stringify(mockActivities));
}

export async function registerActivity(id: string, elderId: string): Promise<void> {
  await mockDelay();
  const activity = mockActivities.find(a => a.id === id);
  if (activity && !activity.registeredElderly.includes(elderId)) {
    activity.registeredElderly.push(elderId);
    activity.currentParticipants++;
  }
}

// === SERVICES ===
export async function getServiceOrders(familyId: string): Promise<ServiceOrder[]> {
  await mockDelay();
  return serviceOrders.filter((o: typeof serviceOrders[number]) => o.familyId === familyId);
}

export async function getServiceOrder(id: string): Promise<ServiceOrder | null> {
  await mockDelay();
  return serviceOrders.find((o: typeof serviceOrders[number]) => o.id === id) || null;
}

export async function createServiceOrder(data: Partial<ServiceOrder>): Promise<{ orderId: string }> {
  await mockDelay();
  const id = `ORD${String(serviceOrders.length + 1).padStart(3, "0")}`;
  serviceOrders.push({ ...data, id, status: "pending", timeline: [{ status: "created", label: "已下单", time: new Date().toLocaleString("zh-CN") }] } as ServiceOrder);
  return { orderId: id };
}

export async function submitServiceReview(id: string, review: ServiceReview): Promise<void> {
  await mockDelay();
  const order = serviceOrders.find((o: typeof serviceOrders[number]) => o.id === id);
  if (order) order.review = review;
}

// === NOTIFICATIONS ===
export async function getNotifications(targetId: string): Promise<Notification[]> {
  await mockDelay();
  return notifications.filter((n: typeof notifications[number]) => n.targetId === targetId);
}

export async function markNotificationRead(id: string): Promise<void> {
  const n = notifications.find((x: typeof notifications[number]) => x.id === id);
  if (n) n.read = true;
}

export async function getUnreadCount(targetId: string): Promise<number> {
  return notifications.filter((n: typeof notifications[number]) => n.targetId === targetId && !n.read).length;
}

// === ANNOUNCEMENTS ===
export async function getAnnouncements(): Promise<Announcement[]> {
  await mockDelay();
  return announcements;
}

// === MONITORING ===
export async function getMonitoringAlerts(): Promise<MonitoringAlert[]> {
  await mockDelay();
  return monitoringAlerts;
}

export async function acknowledgeMonitoring(id: string): Promise<void> {
  const alert = monitoringAlerts.find((a: typeof monitoringAlerts[number]) => a.id === id);
  if (alert) alert.acknowledged = true;
}

// === MEDICAL ===
export async function getMedicalDashboard(staffId: string) {
  await mockDelay();
  const pending = sosAlerts.filter((a: typeof sosAlerts[number]) => a.status === "pending");
  const abnormal = monitoringAlerts.filter((a: typeof sosAlerts[number]) => !a.handled);
  return {
    pendingSOS: pending.length,
    abnormalCount: abnormal.length,
    todayConsultations: 8,
    onlineElders: 156,
    recentSOS: pending.slice(0, 3),
    recentAlerts: abnormal.slice(0, 3),
  };
}

export async function searchElders(q?: string) {
  await mockDelay();
  let result = elders;
  if (q) { const query = q.toLowerCase(); result = elders.filter((e: typeof elders[number]) => e.name.includes(q) || e.community.includes(q)); }
  return { elders: result, total: result.length, page: 1 };
}

export async function getElderRecords(id: string) {
  await mockDelay();
  const elder = elders.find((e: typeof elders[number]) => e.id === id)!;
  return {
    elder,
    medications: [
      { name: "硝苯地平缓释片", dosage: "30mg", frequency: "每日 1 次", startDate: "2024-01-15", status: "服用中" },
      { name: "二甲双胍", dosage: "500mg", frequency: "每日 2 次", startDate: "2024-03-20", status: "服用中" },
    ],
    reports: [
      { date: "2026-06-09", title: "血常规检查报告", url: "/reports/report_001.pdf" },
    ],
  };
}

export async function getElderVitals(id: string) {
  await mockDelay();
  return {
    radar: { bloodPressure: 75, bloodSugar: 82, heartRate: 90, sleep: 65, exercise: 70 },
    anomalies: [{ type: "血压", summary: "近期血压偏高，建议关注" }],
    trends: {} as Record<string, HealthRecord[]>,
  };
}

// === FAMILY ===
export async function getFamilyDashboard(familyId: string, elderId: string) {
  await mockDelay();
  const elder = mockFamilies.flatMap((f: typeof mockFamilies[number]) => f.bindingElders).find((e: typeof elders[number]) => e.elderId === elderId)!;
  const health = await getLatestHealth(elderId);
  const alert = sosAlerts.filter((a: typeof sosAlerts[number]) => a.elderId === elderId && a.status !== "completed" && a.status !== "cancelled")[0] || null;
  return { elder, latestHealth: health, latestAlert: alert };
}

export async function getFamilyBindings(familyId: string): Promise<BindingElder[]> {
  await mockDelay();
  return mockFamilies.find(f => f.id === familyId)?.bindingElders || [];
}

export async function getFamilyProfile(familyId: string): Promise<FamilyMember | null> {
  await mockDelay();
  return mockFamilies.find(f => f.id === familyId) || null;
}
