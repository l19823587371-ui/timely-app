"use client";
import { useState, useEffect } from "react";
import { getActivities, registerActivity } from "@/lib/api";
import { ActivityCard } from "@/components/elder";
import { LoadingSpinner, EmptyState, Modal, Toast } from "@/components/shared";
import type { ToastType } from "@/components/shared/Toast";
import { RefreshCw } from "lucide-react";
import type { Activity } from "@/types/activity";

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [registerModal, setRegisterModal] = useState<Activity | null>(null);
  const [registering, setRegistering] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" as ToastType });

  const fetchActivities = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await getActivities();
      setActivities(data);
    } catch {
      setError("加载活动失败");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleRegister = async (id: string) => {
    setRegistering(true);
    try {
      await registerActivity(id, "E001");
      setActivities((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, currentParticipants: a.currentParticipants + 1, registeredElderly: [...a.registeredElderly, "E001"] }
            : a
        )
      );
      setRegisterModal(null);
      setToast({ visible: true, message: "报名成功！", type: "success" });
    } catch {
      setToast({ visible: true, message: "报名失败，请重试", type: "error" });
    } finally {
      setRegistering(false);
    }
  };

  const openRegisterModal = (activity: Activity) => {
    if (activity.registeredElderly.includes("E001")) return;
    if (activity.currentParticipants >= activity.maxParticipants && activity.maxParticipants > 0) return;
    setRegisterModal(activity);
  };

  return (
    <div className="px-elder-px py-6 pb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-elder-h1">社区活动</h1>
        <button
          onClick={() => fetchActivities(true)}
          disabled={refreshing}
          className="min-w-elder-touch min-h-elder-touch flex items-center justify-center rounded-full hover:bg-border/50 transition-colors"
        >
          <RefreshCw size={28} className={refreshing ? "animate-spin text-primary" : "text-text-secondary"} />
        </button>
      </div>

      {loading && <LoadingSpinner size="md" />}

      {error && (
        <div className="bg-bg-alert text-danger rounded-elder p-4 text-elder-body text-center">
          <p>{error}</p>
          <button onClick={() => fetchActivities()} className="mt-2 text-primary underline text-elder-caption">
            点击重试
          </button>
        </div>
      )}

      {!loading && !error && activities.length === 0 && (
        <EmptyState message="暂无活动" />
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onRegister={(id: string) => { const a = activities.find(x => x.id === id); if (a) openRegisterModal(a); }}
            />
          ))}
        </div>
      )}

      {/* Register Confirm Modal */}
      {registerModal && (
        <Modal
          open={!!registerModal}
          onClose={() => setRegisterModal(null)}
          title="确认报名"
          showCloseButton
        >
          <div className="space-y-4">
            <div>
              <p className="text-elder-body text-text-secondary">
                确认报名参加 <span className="font-bold text-text-primary">{registerModal.name}</span>？
              </p>
              <p className="text-elder-caption text-text-secondary mt-1">
                {registerModal.schedule} · {registerModal.location}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setRegisterModal(null)}
                className="flex-1 min-h-elder-btn rounded-[12px] text-elder-body font-bold border-2 border-border text-text-secondary bg-card hover:bg-background"
              >
                取消
              </button>
              <button
                onClick={() => handleRegister(registerModal.id)}
                disabled={registering}
                className="flex-1 min-h-elder-btn rounded-[12px] text-elder-body font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {registering ? "报名中..." : "确认报名"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
