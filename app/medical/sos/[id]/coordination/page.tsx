"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CoordinationPanel from "@/components/medical/CoordinationPanel";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getSOSAlert } from "@/lib/api";
import type { SOSAlert } from "@/types/sos";

export default function SOSCoordinationPage() {
  const params = useParams();
  const router = useRouter();
  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAlert = async () => {
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
      setError("加载 SOS 详情失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlert();
  }, [params.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNotify = async (targetId: string) => {
    // In production: call actual notify API
    showToast(`已通知 ${targetId}`);
  };

  const handleNotifyAll = async () => {
    // In production: call actual notify-all API
    showToast("已全部通知");
  };

  if (loading) return <LoadingSpinner message="加载协同信息..." />;

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
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5 text-text-secondary"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-medical-h1 text-text-primary">协同通知</h1>
      </div>

      {/* Elder summary */}
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

      <CoordinationPanel
        alertId={alert.id}
        onNotify={handleNotify}
        onNotifyAll={handleNotifyAll}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-medical-body shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
