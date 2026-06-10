"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CallCard from "@/components/medical/CallCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getSOSAlert } from "@/lib/api";
import type { SOSAlert } from "@/types/sos";

export default function SOSAcceptPage() {
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

  if (loading) return <LoadingSpinner message="加载呼叫详情..." />;

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
      <h1 className="text-medical-h1 text-text-primary">接诊处理</h1>
      <CallCard
        alert={alert}
        onVoiceCall={() =>
          router.push(`/medical/consultation/${alert.id}/voice`)
        }
        onVideoCall={() =>
          router.push(`/medical/consultation/${alert.id}/video`)
        }
        onRescue={() =>
          router.push(`/medical/sos/${alert.id}/decision`)
        }
      />
    </div>
  );
}
