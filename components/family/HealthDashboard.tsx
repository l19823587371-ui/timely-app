"use client";

interface HealthMetric {
  label: string;
  value: string;
  unit: string;
  status: "normal" | "warning" | "danger";
  icon: string;
}

interface HealthDashboardProps {
  healthData: {
    bloodPressure?: { systolic: number; diastolic: number; status: "normal" | "warning" | "danger" };
    heartRate?: { bpm: number; status: "normal" | "warning" | "danger" };
    bloodOxygen?: { spo2: number; status: "normal" | "warning" | "danger" };
    bloodSugar?: { value: number; status: "normal" | "warning" | "danger" };
    sleep?: { duration: number };
    fallDetected?: boolean;
  } | null;
  elderName: string;
}

const statusColors: Record<string, string> = {
  normal: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

const statusBg: Record<string, string> = {
  normal: "bg-green-50",
  warning: "bg-yellow-50",
  danger: "bg-red-50",
};

const statusBorder: Record<string, string> = {
  normal: "border-green-200",
  warning: "border-yellow-200",
  danger: "border-red-200",
};

const statusLabel: Record<string, string> = {
  normal: "正常",
  warning: "注意",
  danger: "异常",
};

export default function HealthDashboard({ healthData, elderName }: HealthDashboardProps) {
  if (!healthData) {
    return (
      <div className="bg-card rounded-family p-6 text-center">
        <p className="text-text-disabled font-family-body">暂无健康数据</p>
        <p className="text-text-disabled font-family-caption mt-1">请确保设备已连接</p>
      </div>
    );
  }

  const bpStatus = healthData.bloodPressure?.status || "normal";
  const hrStatus = healthData.heartRate?.status || "normal";
  const spo2Status = healthData.bloodOxygen?.status || "normal";
  const sugarStatus = healthData.bloodSugar?.status || "normal";

  const metrics: HealthMetric[] = [
    {
      label: "血压",
      value: healthData.bloodPressure
        ? `${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`
        : "--/--",
      unit: "mmHg",
      status: bpStatus,
      icon: "🩸",
    },
    {
      label: "心率",
      value: healthData.heartRate ? `${healthData.heartRate.bpm}` : "--",
      unit: "bpm",
      status: hrStatus,
      icon: "💓",
    },
    {
      label: "血氧",
      value: healthData.bloodOxygen ? `${healthData.bloodOxygen.spo2}` : "--",
      unit: "%",
      status: spo2Status,
      icon: "🫁",
    },
    {
      label: "血糖",
      value: healthData.bloodSugar ? `${healthData.bloodSugar.value}` : "--",
      unit: "mmol/L",
      status: sugarStatus,
      icon: "🩸",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-family-h2 text-text-primary">{elderName} 的健康数据</h2>
        {healthData.fallDetected && (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-danger font-family-caption">
            ⚠️ 跌倒检测
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`${statusBg[metric.status]} ${statusBorder[metric.status]} border rounded-family p-4 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-family-caption text-text-secondary">{metric.label}</span>
              <span className="text-xl">{metric.icon}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`font-family-h1 ${statusColors[metric.status]}`}>{metric.value}</span>
              <span className="font-family-caption text-text-secondary">{metric.unit}</span>
            </div>
            <span
              className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-family-caption ${
                metric.status === "normal"
                  ? "bg-green-100 text-green-700"
                  : metric.status === "warning"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {statusLabel[metric.status]}
            </span>
          </div>
        ))}
      </div>
      {healthData.sleep && (
        <div className="bg-card rounded-family p-4 border border-border">
          <div className="flex items-center justify-between">
            <span className="font-family-caption text-text-secondary">😴 昨日睡眠</span>
            <span className="font-family-body text-text-primary">
              {healthData.sleep.duration}h
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
