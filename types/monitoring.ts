export type MonitoringType = "stillness" | "fall" | "heartRate" | "bloodPressure";
export type MonitoringSeverity = "high" | "medium" | "low";

export interface MonitoringAlert {
  id: string;
  elderId: string;
  elderName: string;
  type: MonitoringType;
  severity: MonitoringSeverity;
  detectedAt: string;
  value: string;
  duration?: string;
  community: string;
  acknowledged: boolean;
  handled: boolean;
}
