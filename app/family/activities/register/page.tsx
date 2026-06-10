"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getActivities, registerActivity } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import AppHeader from "@/components/shared/AppHeader";
import Modal from "@/components/shared/Modal";
import Toast from "@/components/shared/Toast";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { Activity } from "@/types/activity";

export default function ActivityRegisterPage() {
  const router = useRouter();
  const { selectedElderId } = useUserStore();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActivities();
      setActivities(data);
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleSelect = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleRegister = async () => {
    if (!selectedActivity) return;
    try {
      setRegistering(true);
      await registerActivity(selectedActivity.id, selectedElderId);
      setToast({ message: `已为家人报名「${selectedActivity.name}」`, type: "success" });
      setShowModal(false);
      // Update local state
      setActivities((prev) =>
        prev.map((a) =>
          a.id === selectedActivity.id
            ? { ...a, currentParticipants: a.currentParticipants + 1, registeredElderly: [...a.registeredElderly, selectedElderId] }
            : a
        )
      );
    } catch {
      setToast({ message: "报名失败，请重试", type: "error" });
    } finally {
      setRegistering(false);
    }
  };

  const categoryIcons: Record<string, string> = {
    "运动": "🏃",
    "学习": "📚",
    "健康": "🩺",
    "文化": "🎨",
    "娱乐": "🎵",
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="活动报名" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
        ) : error ? (
          <div className="py-20">
            <EmptyState message={error} actionLabel="重试" onAction={fetchActivities} />
          </div>
        ) : activities.length === 0 ? (
          <div className="py-20">
            <EmptyState message="暂无活动" />
          </div>
        ) : (
          <div className="space-y-3">
            {activities
              .filter((a) => a.status === "upcoming" || a.status === "ongoing")
              .map((activity) => {
                const isRegistered = activity.registeredElderly.includes(selectedElderId);
                const isFull = activity.maxParticipants > 0 && activity.currentParticipants >= activity.maxParticipants;
                return (
                  <div
                    key={activity.id}
                    onClick={() => !isRegistered && !isFull && handleSelect(activity)}
                    className={`bg-card rounded-family p-4 flex items-start gap-3 transition-all ${
                      isRegistered || isFull
                        ? "opacity-60"
                        : "cursor-pointer active:scale-[0.98]"
                    }`}
                  >
                    {/* Category icon */}
                    <div className="w-12 h-12 rounded-full bg-bg-warm flex items-center justify-center text-2xl flex-shrink-0">
                      {categoryIcons[activity.category] || "📌"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-family-h2 text-text-primary truncate">{activity.name}</h3>
                        {isRegistered && (
                          <span className="flex-shrink-0 ml-2 px-2 py-0.5 rounded-full bg-green-50 text-success font-family-caption">
                            已报名
                          </span>
                        )}
                        {isFull && !isRegistered && (
                          <span className="flex-shrink-0 ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-text-disabled font-family-caption">
                            已满员
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-family-caption text-text-secondary">
                        📅 {activity.schedule} · 📍 {activity.location}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-family-caption text-text-disabled">
                          👨‍🏫 {activity.instructor} · {activity.currentParticipants}/{activity.maxParticipants || "∞"}人
                        </span>
                        {!isRegistered && !isFull && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(activity);
                            }}
                            className="px-3 py-1 rounded-full bg-primary text-white font-family-caption active:scale-95 transition-transform"
                          >
                            报名
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="确认报名"
      >
        <div className="p-4">
          {selectedActivity && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{categoryIcons[selectedActivity.category] || "📌"}</span>
                <h3 className="font-family-h2 text-text-primary">{selectedActivity.name}</h3>
              </div>
              <p className="font-family-body text-text-secondary">
                📅 {selectedActivity.schedule}
              </p>
              <p className="font-family-body text-text-secondary">
                📍 {selectedActivity.location}
              </p>
              <p className="font-family-body text-text-secondary">
                👨‍🏫 {selectedActivity.instructor}
              </p>
              <p className="font-family-body text-text-secondary">
                👥 {selectedActivity.currentParticipants}/{selectedActivity.maxParticipants || "∞"}人已报名
              </p>
            </div>
          )}
          <p className="font-family-caption text-text-disabled mb-4">
            将替选定家人报名参加此活动
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 min-h-family-btn rounded-family border border-border text-text-secondary font-family-body active:scale-[0.98] transition-transform"
            >
              取消
            </button>
            <button
              onClick={handleRegister}
              disabled={registering}
              className="flex-1 min-h-family-btn rounded-family bg-primary text-white font-family-body font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {registering ? "报名中..." : "替老人报名"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast
          visible={!!toast}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
