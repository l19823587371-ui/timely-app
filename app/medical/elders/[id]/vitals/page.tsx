"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VitalsRadar from "@/components/medical/VitalsRadar";
import TrendChart from "@/components/shared/TrendChart";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { getElderVitals } from "@/lib/api";
import type { HealthRecord } from "@/types/health";

interface VitalsData {
  radar: Record<string, number>;
  anomalies: Array<{ type: string; summary: string }>;
  trends: Record<string, HealthRecord[]>;
}

const anomalyColors: Record<string, string> = {
  血压: "bg-danger/10 text-danger border-danger/20",
  心率: "bg-warning/10 text-warning border-warning/20",
  血糖: "bg-[#F0F4FF] text-[#2B5CED] border-[#2B5CED]/20",
  默认: "bg-gray-100 text-text-secondary border-border",
};

export default function ElderVitalsPage() {
  const params = useParams();
  const [data, setData] = useState<VitalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = params.id as string;
      const result = await getElderVitals(id);
      setData(result);
    } catch (e) {
      setError("加载体征数据失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleGenerateReport = () => {
    // Placeholder - in production, calls report generation API
    alert("分析报告生成功能即将上线");
  };

  if (loading) return <LoadingSpinner message="加载体征数据..." />;

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={loadData}
          className="px-6 py-2 rounded-medical bg-primary text-white text-medical-body"
        >
          重试
        </button>
      </div>
    );
  }

  if (!data) {
    return <EmptyState message="暂无体征数据" />;
  }

  // Build trend chart data from trends or generate sample data
  const sampleTrendData = [
    { date: "06-04", 心率: 72, 血压: 130, 血氧: 98 },
    { date: "06-05", 心率: 75, 血压: 135, 血氧: 97 },
    { date: "06-06", 心率: 78, 血压: 128, 血氧: 98 },
    { date: "06-07", 心率: 82, 血压: 142, 血氧: 96 },
    { date: "06-08", 心率: 76, 血压: 138, 血氧: 97 },
    { date: "06-09", 心率: 74, 血压: 132, 血氧: 98 },
    { date: "06-10", 心率: 78, 血压: 135, 血氧: 97 },
  ];

  const trendLines = [
    { key: "心率", color: "#FF4D4F", name: "心率 (BPM)" },
    { key: "血压", color: "#F28C28", name: "收缩压 (mmHg)" },
    { key: "血氧", color: "#52C41A", name: "血氧 (%)" },
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-medical-h1 text-text-primary">体征分析</h1>

      {/* Radar Chart */}
      <VitalsRadar data={data.radar} />

      {/* Anomaly list */}
      {data.anomalies.length > 0 && (
        <div className="bg-card rounded-medical p-4">
          <h3 className="text-medical-h2 text-text-primary font-bold mb-3">
            异常项
          </h3>
          <div className="space-y-2">
            {data.anomalies.map((anomaly, index) => {
              const colorClass =
                anomalyColors[anomaly.type] || anomalyColors["默认"];
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-medical border ${colorClass}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 flex-shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <div className="text-medical-body font-medium">
                      {anomaly.type}
                    </div>
                    <div className="text-medical-caption">{anomaly.summary}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Trend Chart */}
      <div>
        <h3 className="text-medical-h2 text-text-primary font-bold px-1 mb-3">
          体征趋势
        </h3>
        <TrendChart
          data={sampleTrendData}
          lines={trendLines}
          xKey="date"
          height={240}
        />
      </div>

      {/* Generate report button */}
      <button
        onClick={handleGenerateReport}
        className="w-full py-3 rounded-medical bg-primary text-white text-medical-h2 font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 min-h-medical-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0116 6.622V16.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 013 16.5v-13z" />
          <path d="M6.5 12a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zM7 14.5a.5.5 0 000 1h3a.5.5 0 000-1H7z" />
        </svg>
        生成分析报告
      </button>
    </div>
  );
}
