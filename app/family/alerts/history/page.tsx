"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getSOSHistory } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import AppHeader from "@/components/shared/AppHeader";
import AlertCard from "@/components/family/AlertCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { SOSAlert } from "@/types/sos";

type FilterTab = "all" | "emergency" | "sub_emergency";

export default function AlertHistoryPage() {
  const router = useRouter();
  const { selectedElderId } = useUserStore();

  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSOSHistory(selectedElderId);
      setAlerts(data);
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [selectedElderId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const filteredAlerts = useMemo(() => {
    if (filter === "all") return alerts;
    return alerts.filter((a) => a.type === filter);
  }, [alerts, filter]);

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: "all", label: "全部", count: alerts.length },
    { key: "emergency", label: "紧急", count: alerts.filter((a) => a.type === "emergency").length },
    { key: "sub_emergency", label: "次紧急", count: alerts.filter((a) => a.type === "sub_emergency").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="警报记录" onBack={() => router.back()} />

      {/* Filter tabs */}
      <div className="px-family-px pt-4">
        <div className="flex gap-2 bg-card rounded-family p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 py-2 rounded-[10px] font-family-body transition-colors ${
                filter === tab.key
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-bg-warm"
              }`}
            >
              {tab.label} {tab.count !== undefined && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-family-px pt-3 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : error ? (
          <div className="py-20">
            <EmptyState message={error} actionLabel="重试" onAction={fetchHistory} />
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="py-20">
            <EmptyState message={filter === "all" ? "还没有警报记录" : "该类别下暂无警报"} />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onClick={() => router.push(`/family/alert/${alert.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
