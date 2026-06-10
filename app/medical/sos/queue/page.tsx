"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import SOSQueue from "@/components/medical/SOSQueue";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getSOSQueue } from "@/lib/api";
import type { SOSAlert } from "@/types/sos";

interface QueueData {
  emergencies: SOSAlert[];
  subEmergencies: SOSAlert[];
  normals: SOSAlert[];
}

export default function SOSQueuePage() {
  const router = useRouter();
  const [data, setData] = useState<QueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchQueue = useCallback(async () => {
    try {
      setError(null);
      const result = await getSOSQueue();
      setData(result);
    } catch (e) {
      setError("加载 SOS 队列失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    // Auto-refresh every 5 seconds
    intervalRef.current = setInterval(fetchQueue, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchQueue]);

  const handleAccept = (alert: SOSAlert) => {
    router.push(`/medical/sos/${alert.id}/accept`);
  };

  if (loading && !data) {
    return <LoadingSpinner message="加载 SOS 呼叫队列..." />;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={fetchQueue}
          className="px-6 py-2 rounded-medical bg-primary text-white text-medical-body"
        >
          重试
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center">
        <p className="text-text-disabled">暂无数据</p>
      </div>
    );
  }

  const totalCount =
    data.emergencies.length +
    data.subEmergencies.length +
    data.normals.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 pt-4">
        <h1 className="text-medical-h1 text-text-primary">SOS 呼叫队列</h1>
        <span className="text-medical-caption text-text-secondary">
          共 {totalCount} 单待处理
        </span>
      </div>
      <div className="px-4">
        <SOSQueue queues={data} onAccept={handleAccept} />
      </div>
    </div>
  );
}
