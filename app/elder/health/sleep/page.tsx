"use client";
import { useState, useEffect } from "react";
import { getHealthTrend } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import { TrendChart, StatusBadge, LoadingSpinner, EmptyState } from "@/components/shared";
import { SleepBarChart } from "@/components/elder";
import { Moon } from "lucide-react";
import type { HealthRecord } from "@/types/health";

type Period = "week" | "month" | "3months";
const PERIODS: { key: Period; label: string }[] = [
  { key: "week", label: "近7天" },
  { key: "month", label: "近1月" },
  { key: "3months", label: "近3月" },
];

export default function SleepDetailPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getHealthTrend("sleep", "E001", period)
      .then(setRecords)
      .catch(() => setError("加载失败"))
      .finally(() => setLoading(false));
  }, [period]);

  const latest = records[records.length - 1];
  const sleepStatus: "normal" | "warning" | "danger" =
    !latest ? "normal" :
    latest.sleep.duration < 5 ? "danger" :
    latest.sleep.duration < 6 ? "warning" : "normal";

  const chartData = records.map((r) => ({
    date: new Date(r.recordedAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
    duration: parseFloat(r.sleep.duration.toFixed(1)),
  }));

  const barData = records.map((r) => ({
    date: new Date(r.recordedAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" }),
    deepSleep: parseFloat(r.sleep.deepSleep.toFixed(1)),
    lightSleep: parseFloat(r.sleep.lightSleep.toFixed(1)),
  }));

  return (
    <>
      <AppHeader title="睡眠详情" />
      <div className="px-elder-px py-4 space-y-5">
        {latest && (
          <div className="bg-card rounded-elder p-elder-px text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Moon size={28} className="text-primary" />
              <span className="text-elder-h2">昨晚睡眠</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-sos-number text-text-primary">{latest.sleep.duration.toFixed(1)}</span>
              <span className="text-elder-caption text-text-disabled">小时</span>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <span className="text-elder-caption text-text-secondary">
                深睡 <span className="font-bold text-primary">{latest.sleep.deepSleep.toFixed(1)}h</span>
              </span>
              <span className="text-elder-caption text-text-secondary">
                浅睡 <span className="font-bold text-[#FFD699]">{latest.sleep.lightSleep.toFixed(1)}h</span>
              </span>
            </div>
            <div className="mt-3">
              <StatusBadge status={sleepStatus} />
            </div>
          </div>
        )}

        <div className="flex gap-3">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-6 py-2 rounded-full text-elder-body font-medium transition-colors ${
                period === p.key ? "bg-primary text-white" : "bg-card text-text-secondary border-2 border-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner size="md" />}
        {error && <div className="text-elder-body text-danger text-center py-4">{error}</div>}
        {!loading && !error && records.length === 0 && <EmptyState message="暂无睡眠数据" />}

        {!loading && !error && records.length > 0 && (
          <>
            <div className="bg-card rounded-elder p-elder-px">
              <h4 className="text-elder-h2 mb-3">睡眠时长趋势</h4>
              <TrendChart data={chartData} dataKey="duration" color="#F28C28" unit="h" />
            </div>
            <div className="bg-card rounded-elder p-elder-px">
              <h4 className="text-elder-h2 mb-3">深睡/浅睡分布</h4>
              <SleepBarChart data={barData} />
            </div>
          </>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="bg-card rounded-elder p-elder-px">
            <h4 className="text-elder-h2 mb-3">最近记录</h4>
            <div className="space-y-2">
              {records.slice(-5).reverse().map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-elder-body text-text-secondary">
                    {new Date(r.recordedAt).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-elder-body font-bold text-text-primary">{r.sleep.duration.toFixed(1)}h</span>
                    <span className="text-elder-caption text-text-disabled">
                      深{r.sleep.deepSleep.toFixed(1)}h · 浅{r.sleep.lightSleep.toFixed(1)}h
                    </span>
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
