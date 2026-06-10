"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface SleepBarChartProps {
  data: Array<{ date: string; deepSleep: number; lightSleep: number }>;
  className?: string;
  height?: number;
}

export default function SleepBarChart({ data, className, height = 220 }: SleepBarChartProps) {
  if (!data.length) return null;

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F2E8DE" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#BBBBBB"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#BBBBBB"
            tickLine={false}
            axisLine={false}
            unit="h"
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #F2E8DE", fontSize: 16 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 14 }}
            formatter={(v: string) => v === "deepSleep" ? "深睡" : "浅睡"}
          />
          <Bar dataKey="deepSleep" fill="#F28C28" stackId="sleep" radius={[0, 0, 0, 0]} name="deepSleep" />
          <Bar dataKey="lightSleep" fill="#FFD699" stackId="sleep" radius={[6, 6, 0, 0]} name="lightSleep" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
