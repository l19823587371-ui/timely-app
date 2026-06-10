"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { getAnnouncements } from "@/lib/api";
import type { Announcement } from "@/types/announcement";

type TabKey = "all" | "system" | "community" | "schedule";

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "system", label: "系统" },
  { key: "community", label: "社区" },
  { key: "schedule", label: "排班" },
];

const categoryColors: Record<string, string> = {
  system: "bg-[#2B5CED]",
  community: "bg-success",
  schedule: "bg-primary",
};

const categoryLabels: Record<string, string> = {
  system: "系统",
  community: "社区",
  schedule: "排班",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAnnouncements();
      setAnnouncements(result);
    } catch (e) {
      setError("加载公告失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    activeTab === "all"
      ? announcements
      : announcements.filter((a) => a.category === activeTab);

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--";
    }
  };

  if (loading) return <LoadingSpinner message="加载公告中..." />;

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

  return (
    <div className="space-y-4">
      <h1 className="text-medical-h1 text-text-primary px-4 pt-4">
        公告通知
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-border px-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-4 py-3 text-medical-body font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState message="暂无公告通知" />
      ) : (
        <div className="px-4 space-y-3">
          {filtered.map((ann) => {
            const isRead = ann.readBy.length > 0;
            const stripeColor =
              categoryColors[ann.category] || "bg-gray-300";
            return (
              <div
                key={ann.id}
                className={`bg-card rounded-medical overflow-hidden border-l-4 ${stripeColor} ${
                  !isRead ? "shadow-sm" : "opacity-70"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
                        )}
                        <h3 className="text-medical-h2 text-text-primary font-medium truncate">
                          {ann.title}
                        </h3>
                      </div>
                      <p className="text-medical-body text-text-secondary mt-1 line-clamp-2">
                        {ann.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-medical-caption text-text-disabled">
                          {formatTime(ann.publishedAt)}
                        </span>
                        <span
                          className={`text-medical-caption px-2 py-0.5 rounded ${
                            ann.category === "system"
                              ? "bg-[#F0F4FF] text-[#2B5CED]"
                              : ann.category === "community"
                              ? "bg-[#F0FFF4] text-success"
                              : "bg-[#FFF6EF] text-primary"
                          }`}
                        >
                          {categoryLabels[ann.category]}
                        </span>
                        <span
                          className={`text-medical-caption ${
                            isRead ? "text-text-disabled" : "text-danger font-medium"
                          }`}
                        >
                          {isRead ? "已读" : "未读"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
