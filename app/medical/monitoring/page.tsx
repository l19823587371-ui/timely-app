"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import MonitoringList from "@/components/medical/MonitoringList";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getMonitoringAlerts, acknowledgeMonitoring } from "@/lib/api";
import type { MonitoringAlert } from "@/types/monitoring";

export default function MonitoringPage() {
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [acknowledging, setAcknowledging] = useState<Set<string>>(new Set());

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const result = await getMonitoringAlerts();
      setAlerts(result);
    } catch (e) {
      setError("加载监测告警失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    // Auto-refresh every 5 seconds
    intervalRef.current = setInterval(fetchAlerts, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAlerts]);

  const handleAcknowledge = async (id: string) => {
    try {
      setAcknowledging((prev) => new Set(prev).add(id));
      await acknowledgeMonitoring(id);
      // Update local state
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      );
    } catch (e) {
      // Silently fail, will be picked up on next poll
    } finally {
      setAcknowledging((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading && alerts.length === 0) {
    return <LoadingSpinner message="加载异常监测..." />;
  }

  if (error && alerts.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={fetchAlerts}
          className="px-6 py-2 rounded-medical bg-primary text-white text-medical-body"
        >
          重试
        </button>
      </div>
    );
  }

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-medical-h1 text-text-primary">异常监测</h1>
        <div className="flex items-center gap-2">
          {unacknowledgedCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          )}
          <span className="text-medical-caption text-text-secondary">
            {unacknowledgedCount > 0
              ? `${unacknowledgedCount} 条待确认`
              : "全部已确认"}
          </span>
        </div>
      </div>
      <div className="px-4">
        <MonitoringList
          alerts={alerts}
          onAcknowledge={handleAcknowledge}
          loading={loading && alerts.length === 0}
        />
      </div>
    </div>
  );
}
