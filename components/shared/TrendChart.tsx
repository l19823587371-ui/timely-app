"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export interface TrendLine {
  key: string;
  color: string;
  name: string;
}

export interface TrendChartProps {
  data: Array<Record<string, any>>;
  lines?: TrendLine[];
  xKey?: string;
  height?: number;
  className?: string;
  // Simple single-line mode
  dataKey?: string;
  color?: string;
  name?: string;
  unit?: string;
}

export default function TrendChart({
  data,
  lines: linesProp,
  xKey: xKeyProp,
  dataKey,
  color,
  name,
  unit,
  height = 240,
  className,
}: TrendChartProps) {
  // Support both modes: lines array OR simple dataKey+color
  const lines: TrendLine[] = linesProp || (dataKey
    ? [{ key: dataKey, color: color || "#F28C28", name: name || (unit ? `${dataKey} (${unit})` : dataKey) }]
    : []);
  const xKey = xKeyProp || "date";

  const isEmpty = !data || data.length === 0;

  if (isEmpty) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-card rounded-xl border border-border",
          className
        )}
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-text-disabled">暂无趋势数据</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border p-3", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F2E8DE" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: "#999" }}
            tickLine={false}
            axisLine={{ stroke: "#F2E8DE" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#999" }}
            tickLine={false}
            axisLine={{ stroke: "#F2E8DE" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #F2E8DE",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2.5}
              dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: line.color, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
