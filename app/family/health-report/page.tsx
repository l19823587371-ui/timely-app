"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getWeeklyReport } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import AppHeader from "@/components/shared/AppHeader";
import WeeklyReport from "@/components/family/WeeklyReport";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { WeeklyReport as WeeklyReportType } from "@/types/health";

export default function HealthReportPage() {
  const router = useRouter();
  const { selectedElderId } = useUserStore();

  const [report, setReport] = useState<WeeklyReportType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeeklyReport(selectedElderId);
      setReport(data);
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [selectedElderId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="健康周报" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="健康周报" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh] px-4">
          <EmptyState message={error || "暂无报告"} actionLabel="重试" onAction={fetchReport} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="健康周报" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6">
        <WeeklyReport report={report} />

        {/* Share button */}
        <button
          className="mt-4 w-full min-h-family-btn rounded-family border border-primary text-primary font-family-body flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享健康报告
        </button>
      </div>
    </div>
  );
}
