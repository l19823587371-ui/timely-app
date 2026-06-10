"use client";

import type { WeeklyReport as WeeklyReportType } from "@/types/health";

interface WeeklyReportProps {
  report: WeeklyReportType;
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const scoreColor =
    score >= 80 ? "#52C41A" : score >= 60 ? "#FAAD14" : "#FF4D4F";

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke="#E8E8E8" strokeWidth="10"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-[32px]" style={{ color: scoreColor }}>
          {score}
        </span>
        <span className="font-family-caption text-text-secondary">健康分</span>
      </div>
    </div>
  );
}

function getTrendIcon(trend: string): { icon: string; color: string } {
  switch (trend) {
    case "rising":
      return { icon: "📈", color: "text-warning" };
    case "falling":
    case "declining":
      return { icon: "📉", color: "text-danger" };
    default:
      return { icon: "📊", color: "text-success" };
  }
}

function getTrendLabel(trend: string): string {
  switch (trend) {
    case "rising":
      return "上升";
    case "falling":
    case "declining":
      return "下降";
    default:
      return "正常";
  }
}

export default function WeeklyReport({ report }: WeeklyReportProps) {
  const weekLabel = `${report.weekStart} ~ ${report.weekEnd}`;

  const healthIndicators = [
    { label: "血压", trend: report.bpTrend, icon: "🩸" },
    { label: "心率", trend: report.hrTrend, icon: "💓" },
    { label: "血氧", trend: report.spo2Trend, icon: "🫁" },
    { label: "睡眠", trend: report.sleepTrend, icon: "😴" },
  ];

  return (
    <div className="space-y-4">
      {/* Header with score */}
      <div className="bg-card rounded-family p-6">
        <div className="text-center mb-4">
          <h2 className="font-family-h1 text-text-primary mb-1">本周健康报告</h2>
          <p className="font-family-caption text-text-disabled">{weekLabel}</p>
        </div>

        <ScoreCircle score={report.score} />

        {report.scoreChange !== 0 && (
          <p className="text-center mt-3 font-family-caption">
            <span className={report.scoreChange > 0 ? "text-success" : "text-danger"}>
              {report.scoreChange > 0 ? "+" : ""}
              {report.scoreChange}
            </span>
            <span className="text-text-disabled"> 相比上周</span>
          </p>
        )}
      </div>

      {/* Health indicators grid */}
      <div className="bg-card rounded-family p-4">
        <h3 className="font-family-h2 text-text-primary mb-3">指标趋势</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {healthIndicators.map((indicator) => {
            const trend = getTrendIcon(indicator.trend);
            return (
              <div key={indicator.label} className="bg-background rounded-family p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-family-caption text-text-secondary">{indicator.icon} {indicator.label}</span>
                  <span className={`text-lg ${trend.color}`}>{trend.icon}</span>
                </div>
                <span className={`font-family-body ${trend.color}`}>
                  {getTrendLabel(indicator.trend)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomalies */}
      {report.anomalies.length > 0 && (
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">
            ⚠️ 异常记录 ({report.anomalies.length})
          </h3>
          <div className="space-y-2">
            {report.anomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-family ${
                  anomaly.severity === "danger" ? "bg-red-50" : "bg-yellow-50"
                }`}
              >
                <div>
                  <span className="font-family-body text-text-primary">{anomaly.type}</span>
                  <span className="ml-2 font-family-caption text-text-secondary">
                    {anomaly.value}
                  </span>
                </div>
                <span className="font-family-caption text-text-disabled">{anomaly.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {report.suggestions.length > 0 && (
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">💡 健康建议</h3>
          <ul className="space-y-2">
            {report.suggestions.map((s, idx) => (
              <li key={idx} className="font-family-body text-text-secondary flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Medications */}
      {report.medications.length > 0 && (
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">💊 用药情况</h3>
          <div className="space-y-3">
            {report.medications.map((med) => (
              <div key={med.name} className="flex items-center justify-between p-3 bg-background rounded-family">
                <div>
                  <p className="font-family-body text-text-primary">{med.name}</p>
                  <p className="font-family-caption text-text-secondary">
                    {med.dosage} · {med.frequency}
                  </p>
                </div>
                <div className="text-right">
                  {med.missedThisWeek > 0 && (
                    <p className="font-family-caption text-danger">
                      漏服 {med.missedThisWeek} 次
                    </p>
                  )}
                  <span
                    className={`font-family-caption ${
                      med.status === "normal" ? "text-success" : "text-warning"
                    }`}
                  >
                    {med.status === "normal" ? "✅ 正常" : "⚠️ 注意"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
