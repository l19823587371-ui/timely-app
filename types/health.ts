export type HealthStatus = "normal" | "warning" | "danger";

export interface HealthRecord {
  id: string;
  elderId: string;
  recordedAt: string;
  bloodPressure: { systolic: number; diastolic: number; unit: "mmHg"; status: HealthStatus };
  heartRate: { bpm: number; status: HealthStatus };
  bloodOxygen: { spo2: number; status: HealthStatus };
  bloodSugar?: { value: number; type: "fasting" | "postprandial"; status: HealthStatus };
  sleep: { duration: number; deepSleep: number; lightSleep: number };
  ecg: { waveform: "normal" | "abnormal"; abnormalities: string[] };
  fallDetected: boolean;
  stillnessMinutes: number;
}

export interface MedicationStatus {
  name: string;
  dosage: string;
  frequency: string;
  missedThisWeek: number;
  status: "normal" | "warning";
}

export interface WeeklyReport {
  elderId: string;
  weekStart: string;
  weekEnd: string;
  score: number;
  scoreChange: number;
  bpTrend: "normal" | "rising" | "falling";
  hrTrend: "normal" | "rising" | "falling";
  spo2Trend: "normal" | "falling";
  sleepTrend: "normal" | "declining";
  anomalies: Array<{ date: string; type: string; value: string; severity: "warning" | "danger" }>;
  suggestions: string[];
  medications: MedicationStatus[];
}
