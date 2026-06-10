"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface VitalsRadarProps {
  data: Record<string, number>;
}

const vitalsLabels: Record<string, string> = {
  bloodPressure: "血压",
  bloodSugar: "血糖",
  heartRate: "心率",
  sleep: "睡眠",
  exercise: "运动",
};

export default function VitalsRadar({ data }: VitalsRadarProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    vital: vitalsLabels[key] || key,
    value,
    fullMark: 100,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-card rounded-medical p-8 text-center">
        <p className="text-medical-body text-text-disabled">暂无体征数据</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-medical p-4">
      <h3 className="text-medical-h2 text-text-primary font-bold mb-4 px-1">体征雷达图</h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#E8E8E8" />
          <PolarAngleAxis
            dataKey="vital"
            tick={{ fontSize: 13, fill: "#666666" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#BBBBBB" }}
            tickCount={5}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #F2E8DE",
              fontSize: "13px",
            }}
            formatter={(value: number) => [`${value} / 100`, "评分"]}
          />
          <Radar
            name="健康评分"
            dataKey="value"
            stroke="#F28C28"
            fill="#F28C28"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
