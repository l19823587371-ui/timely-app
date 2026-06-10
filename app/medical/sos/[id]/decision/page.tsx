"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RescueDecision from "@/components/medical/RescueDecision";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getSOSAlert } from "@/lib/api";
import type { SOSAlert } from "@/types/sos";

export default function SOSDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <LoadingSpinner message="加载救援决策..." />;

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

  const handleConfirm = () => {
    router.push(`/medical/sos/${alert.id}/progress`);
  };

  const handleTransfer = () => {
    // Navigate to coordination for transfer
    router.push(`/medical/sos/${alert.id}/coordination`);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-medical-h1 text-text-primary">救援决策</h1>
      <RescueDecision
        alert={alert}
        onConfirm={handleConfirm}
        onTransfer={handleTransfer}
        estimatedETA="约 5 分钟"
        distance="约 1.2 公里"
      />
    </div>
  );
}
