"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLatestHealth } from "@/lib/api";
import { HealthMetricCard } from "@/components/elder";
import { LoadingSpinner } from "@/components/shared";
import { Heart, Activity, Droplets, Moon } from "lucide-react";
import type { HealthRecord } from "@/types/health";

export default function ElderHealthPage() {
  const router = useRouter();
  const [health, setHealth] = useState<Partial<HealthRecord> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    getLatestHealth("E001")
      .then((data) => {
        setHealth(data);
        if (data?.recordedAt) {
          const d = new Date(data.recordedAt);
          setLastUpdated(`${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`);
        }
      })
      .catch(() => setError("加载健康数据失败"))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  if (error) {
    return (
      <div className="px-elder-px pt-6">
        <h1 className="text-elder-h1 mb-4">健康监测</h1>
        <div className="bg-bg-alert text-danger rounded-elder p-4 text-elder-body text-center">{error}</div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="px-elder-px pt-6">
        <h1 className="text-elder-h1 mb-4">健康监测</h1>
        <div className="text-elder-body text-text-secondary text-center py-12">暂无健康数据</div>
      </div>
    );
  }

  return (
    <div className="px-elder-px pt-6 pb-4">
      <h1 className="text-elder-h1 mb-1">健康监测</h1>
      <p className="text-elder-caption text-text-secondary mb-6">{dateStr}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <HealthMetricCard
          icon={Heart}
          label="血压"
          value={health.bloodPressure ? `${health.bloodPressure.systolic}/${health.bloodPressure.diastolic}` : "--"}
          unit="mmHg"
          status={health.bloodPressure?.status || "normal"}
          onClick={() => router.push("/elder/health/blood-pressure")}
        />
        <HealthMetricCard
          icon={Activity}
          label="心率"
          value={health.heartRate?.bpm ?? "--"}
          unit="bpm"
          status={health.heartRate?.status || "normal"}
          onClick={() => router.push("/elder/health/heart-rate")}
        />
        <HealthMetricCard
          icon={Droplets}
          label="血氧"
          value={health.bloodOxygen?.spo2 ?? "--"}
          unit="%"
          status={health.bloodOxygen?.status || "normal"}
          onClick={() => router.push("/elder/health/oxygen")}
        />
        <HealthMetricCard
          icon={Moon}
          label="睡眠"
          value={health.sleep?.duration ? `${health.sleep.duration.toFixed(1)}` : "--"}
          unit="h"
          status={health.sleep?.duration && health.sleep.duration < 5 ? "warning" : "normal"}
          onClick={() => router.push("/elder/health/sleep")}
        />
      </div>

      {lastUpdated && (
        <p className="text-elder-caption text-text-disabled text-center mt-6">
          最后更新: {lastUpdated}
        </p>
      )}
    </div>
  );
}
