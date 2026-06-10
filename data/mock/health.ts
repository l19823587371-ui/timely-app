import type { HealthRecord } from "@/types/health";

function generateHealthRecords(): HealthRecord[] {
  const records: HealthRecord[] = [];
  const base = new Date("2026-05-12");
  for (let i = 0; i < 30; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    records.push({
      id: `HR${String(i + 1).padStart(3, "0")}`,
      elderId: "E001",
      recordedAt: `${dateStr}T07:30:00+08:00`,
      bloodPressure: { systolic: 138 + Math.floor(Math.random() * 10), diastolic: 82 + Math.floor(Math.random() * 10), unit: "mmHg", status: Math.random() > 0.7 ? "warning" : "normal" },
      heartRate: { bpm: 72 + Math.floor(Math.random() * 10), status: "normal" },
      bloodOxygen: { spo2: 96 + Math.floor(Math.random() * 3), status: "normal" },
      bloodSugar: { value: 5.5 + Math.random() * 1.5, type: "fasting", status: Math.random() > 0.8 ? "warning" : "normal" },
      sleep: { duration: 5.5 + Math.random() * 2.5, deepSleep: 1.5 + Math.random() * 1.5, lightSleep: 3 + Math.random() * 2 },
      ecg: { waveform: "normal", abnormalities: [] },
      fallDetected: false,
      stillnessMinutes: Math.floor(Math.random() * 10),
    });
  }
  return records;
}

export const mockHealthRecords: HealthRecord[] = generateHealthRecords();
