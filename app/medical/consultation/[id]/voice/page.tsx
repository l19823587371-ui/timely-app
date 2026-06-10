"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import VoiceCallControls from "@/components/medical/VoiceCallControls";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getSOSAlert } from "@/lib/api";
import type { SOSAlert } from "@/types/sos";

export default function VoiceConsultationPage() {
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
      setError("加载呼叫详情失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlert();
  }, [params.id]);

  if (loading) return <LoadingSpinner message="建立语音连接..." />;

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
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-medical-body text-text-secondary hover:text-text-primary transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        返回
      </button>

      <VoiceCallControls
        elderName={alert.elderName}
        duration={0}
        onHangup={() => router.back()}
        onRecord={() => {}}
        onMute={() => {}}
        onConnectVideo={() =>
          router.push(`/medical/consultation/${alert.id}/video`)
        }
        onSpeakerToggle={() => {}}
      />
    </div>
  );
}
