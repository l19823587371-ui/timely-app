"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import RescueProgressUpdate from "@/components/medical/RescueProgressUpdate";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getSOSAlert, updateSOSProgress } from "@/lib/api";
import type { SOSAlert, RescueStep } from "@/types/sos";

export default function SOSProgressPage() {
  const params = useParams();
  const router = useRouter();
  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAlert = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const id = params.id as string;
      const result = await getSOSAlert(id);
      if (!result) {
        setError("未找到该 SOS 呼叫");
        return;
      }
      setAlert(result);
    } catch (e) {
      setError("加载救援进度失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadAlert();
  }, [loadAlert]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdate = async (step: string, time: string, note: string) => {
    try {
      setSaving(true);
      const id = params.id as string;
      await updateSOSProgress(id, step, note);
      showToast("进度更新成功");
      // Refresh data
      await loadAlert();
    } catch (e) {
      showToast("更新失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="加载救援进度..." />;

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={loadAlert}
          className="px-6 py-2 rounded-medical bg-primary text-white text-medical-body"
        >
          重试
        </button>
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-4 text-center">
        <p className="text-text-disabled">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-medical-h1 text-text-primary">救援进度</h1>
        <button
          onClick={() => router.push(`/medical/sos/${alert.id}/coordination`)}
          className="px-3 py-1.5 rounded-medical border border-primary text-primary text-medical-caption hover:bg-primary/5 transition-colors"
        >
          协同通知
        </button>
      </div>

      {/* Elder info summary */}
      <div className="bg-card rounded-medical p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {alert.elderName.charAt(0)}
        </div>
        <div>
          <div className="text-medical-h2 text-text-primary">{alert.elderName}</div>
          <div className="text-medical-caption text-text-secondary">
            {alert.elderAge}岁 · {alert.address.slice(0, 20)}
          </div>
        </div>
      </div>

      <RescueProgressUpdate
        steps={alert.rescueProgress}
        onUpdate={handleUpdate}
      />

      {/* Saving indicator */}
      {saving && (
        <div className="flex items-center justify-center gap-2 text-medical-caption text-text-secondary">
          <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          保存中...
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-medical-body shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
