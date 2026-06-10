"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHealthTrend } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import { TrendChart, StatusBadge, LoadingSpinner, EmptyState } from "@/components/shared";
import { Heart } from "lucide-react";
import type { HealthRecord } from "@/types/health";

type Period = "week" | "month" | "3months";
const PERIODS: { key: Period; label: string }[] = [
  { key: "week", label: "近7天" },
  { key: "month", label: "近1月" },
  { key: "3months", label: "近3月" },
];

export default function BloodPressureDetailPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("week");
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getHealthTrend("bloodPressure", "E001", period)
      .then(setRecords)
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [period]);

  const latest = records[records.length - 1];
  const chartData = records.map((r) => ({
    date: new Date(r.recordedAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
    systolic: r.bloodPressure.systolic,
    diastolic: r.bloodPressure.diastolic,
  }));

  return (
    <>
      <AppHeader title="血压详情" />
      <div className="px-elder-px py-4 space-y-5">
        {/* Current Value */}
        {latest && (
          <div className="bg-card rounded-elder p-elder-px text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart size={28} className="text-danger" />
              <span className="text-elder-h2">当前血压</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-sos-number text-text-primary">{latest.bloodPressure.systolic}</span>
              <span className="text-elder-h1 text-text-disabled">/</span>
              <span className="text-elder-h1 text-text-primary">{latest.bloodPressure.diastolic}</span>
              <span className="text-elder-caption text-text-disabled">mmHg</span>
            </div>
            <div className="mt-3">
              <StatusBadge status={latest.bloodPressure.status} />
            </div>
          </div>
        )}

        {/* Period Filter */}
        <div className="flex gap-3">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-6 py-2 rounded-full text-elder-body font-medium transition-colors ${
                period === p.key
                  ? "bg-primary text-white"
                  : "bg-card text-text-secondary border-2 border-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        {loading && <LoadingSpinner size="md" />}
        {error && <div className="text-elder-body text-danger text-center py-4">{error}</div>}
        {!loading && !error && records.length === 0 && (
          <EmptyState message="暂无血压数据" />
        )}
        {!loading && !error && records.length > 0 && (
          <>
            <div className="bg-card rounded-elder p-elder-px">
              <h4 className="text-elder-h2 mb-3">收缩压趋势</h4>
              <TrendChart data={chartData} dataKey="systolic" color="#FF4D4F" unit="mmHg" />
            </div>
            <div className="bg-card rounded-elder p-elder-px">
              <h4 className="text-elder-h2 mb-3">舒张压趋势</h4>
              <TrendChart data={chartData} dataKey="diastolic" color="#F28C28" unit="mmHg" />
            </div>
          </>
        )}

        {/* Recent Records */}
        {!loading && !error && records.length > 0 && (
          <div className="bg-card rounded-elder p-elder-px">
            <h4 className="text-elder-h2 mb-3">最近记录</h4>
            <div className="space-y-2">
              {records.slice(-5).reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-elder-body text-text-secondary">
                    {new Date(r.recordedAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-elder-body font-bold text-text-primary">
                      {r.bloodPressure.systolic}/{r.bloodPressure.diastolic}
                    </span>
                    <StatusBadge status={r.bloodPressure.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
