"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFamilyDashboard, getNotifications } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import { useNotificationStore } from "@/store/notificationStore";
import AppHeader from "@/components/shared/AppHeader";
import HealthDashboard from "@/components/family/HealthDashboard";
import FamilyMemberCard from "@/components/family/FamilyMemberCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { BindingElder } from "@/types/family";
import type { SOSAlert } from "@/types/sos";
import type { HealthRecord } from "@/types/health";

interface DashboardData {
  elder: BindingElder;
  latestHealth: Partial<HealthRecord> | null;
  latestAlert: SOSAlert | null;
}

export default function FamilyDashboardPage() {
  const router = useRouter();
  const { selectedElderId, setSelectedElder } = useUserStore();
  const { unreadCount, setNotifications } = useNotificationStore();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const familyId = "F001";

  const fetchData = useCallback(async (elderId: string) => {
    try {
      setLoading(true);
      setError(null);
      const [data, notifs] = await Promise.all([
        getFamilyDashboard(familyId, elderId),
        getNotifications(familyId),
      ]);
      setDashboardData(data);
      setNotifications(notifs);
    } catch (err) {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [setNotifications]);

  useEffect(() => {
    fetchData(selectedElderId);
  }, [selectedElderId, fetchData]);

  // Mock list of elders for selector
  const mockElders: BindingElder[] = [
    { elderId: "E001", elderName: "张桂芳", relation: "母亲", healthStatus: "normal", avatar: "/images/elder_001.png", age: 72 },
    { elderId: "E002", elderName: "张建国", relation: "父亲", healthStatus: "warning", avatar: "/images/elder_002.png", age: 78 },
  ];

  const quickActions = [
    { label: "警报记录", icon: "🚨", path: `/family/alerts/history` },
    { label: "健康周报", icon: "📊", path: `/family/health-report` },
    { label: "服务预约", icon: "📋", path: `/family/services/book` },
    { label: "活动报名", icon: "🎯", path: `/family/activities/register` },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="家庭看护" />
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="家庭看护" />
        <div className="flex items-center justify-center h-[60vh]">
          <EmptyState message={error} actionLabel="重试" onAction={() => fetchData(selectedElderId)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="家庭看护"
        rightAction={
          <button onClick={() => router.push("/family/notifications")} className="relative">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-danger text-white font-family-caption flex items-center justify-center text-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        }
      />

      <div className="px-family-px pt-4 pb-6 space-y-4">
        {/* Greeting */}
        <div>
          <h1 className="font-family-h1 text-text-primary">👋 下午好</h1>
          <p className="font-family-caption text-text-secondary mt-1">及时守护家人的健康</p>
        </div>

        {/* Elder selector */}
        <div className="space-y-2">
          {mockElders.map((elder) => (
            <FamilyMemberCard
              key={elder.elderId}
              elder={elder}
              selected={elder.elderId === selectedElderId}
              onSelect={() => setSelectedElder(elder.elderId)}
            />
          ))}
        </div>

        {/* Health Dashboard */}
        {dashboardData && (
          <HealthDashboard
            healthData={dashboardData.latestHealth}
            elderName={dashboardData.elder.elderName}
          />
        )}

        {/* Latest alert card */}
        {dashboardData?.latestAlert && (
          <div
            onClick={() => router.push(`/family/alert/${dashboardData.latestAlert!.id}`)}
            className="bg-red-50 border border-red-200 rounded-family p-4 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚨</span>
                <div>
                  <p className="font-family-body text-danger font-semibold">
                    {dashboardData.latestAlert.elderName} · 紧急求助
                  </p>
                  <p className="font-family-caption text-text-secondary">
                    {new Date(dashboardData.latestAlert.triggerTime).toLocaleString("zh-CN", {
                      month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div>
          <h3 className="font-family-h2 text-text-primary mb-3">快捷操作</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => router.push(action.path)}
                className="bg-card rounded-family p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform shadow-sm"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-family-caption text-text-secondary">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
