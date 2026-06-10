"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getNotifications, markNotificationRead } from "@/lib/api";
import { useNotificationStore } from "@/store/notificationStore";
import AppHeader from "@/components/shared/AppHeader";
import NotificationItem from "@/components/family/NotificationItem";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { Notification, NotificationCategory } from "@/types/notification";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, setNotifications, markAsRead } = useNotificationStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationCategory | "all">("all");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications("F001");
      setNotifications(data);
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [setNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClick = async (notification: Notification) => {
    try {
      await markNotificationRead(notification.id);
    } catch {
      // Best effort
    }
    markAsRead(notification.id);

    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {};
    filteredNotifications.forEach((n) => {
      const dateKey = new Date(n.publishedAt).toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(n);
    });
    return groups;
  }, [filteredNotifications]);

  const tabs: { key: NotificationCategory | "all"; label: string }[] = [
    { key: "all", label: "全部" },
    { key: "alert", label: "警报" },
    { key: "health", label: "健康" },
    { key: "activity", label: "活动" },
    { key: "system", label: "系统" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="消息通知" onBack={() => router.back()} />

      {/* Filter tabs */}
      <div className="px-family-px pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full font-family-caption whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? "bg-primary text-white"
                  : "bg-card text-text-secondary border border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : error ? (
          <div className="py-20 px-family-px">
            <EmptyState message={error} actionLabel="重试" onAction={fetchNotifications} />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-20 px-family-px">
            <EmptyState message="暂无通知" />
          </div>
        ) : (
          <div>
            {Object.entries(grouped).map(([dateKey, items]) => (
              <div key={dateKey}>
                <div className="px-family-px py-3">
                  <span className="font-family-caption text-text-disabled">{dateKey}</span>
                </div>
                <div className="divide-y divide-border">
                  {items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={() => handleClick(notification)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
