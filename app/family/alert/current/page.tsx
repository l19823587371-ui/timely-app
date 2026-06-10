"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSOSAlert, acceptSOS } from "@/lib/api";
import AlertBanner from "@/components/family/AlertBanner";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { SOSAlert } from "@/types/sos";

export default function AlertCurrentPage() {
  const router = useRouter();
  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the latest pending emergency alert
    const fetchAlert = async () => {
      try {
        setLoading(true);
        // Use SOS002 which is the active pending alert
        const data = await getSOSAlert("SOS002");
        if (!data) {
          setError("没有活跃的警报");
        } else {
          setAlert(data);
        }
      } catch {
        setError("加载警报失败");
      } finally {
        setLoading(false);
      }
    };
    fetchAlert();
  }, []);

  const handleRespond = async () => {
    if (!alert) return;
    try {
      await acceptSOS(alert.id, "F001");
      router.push(`/family/alert/${alert.id}`);
    } catch {
      // Continue anyway
      router.push(`/family/alert/${alert.id}`);
    }
  };

  const handleViewDetail = () => {
    if (alert) {
      router.push(`/family/alert/${alert.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <EmptyState
          message={error || "当前没有正在进行的紧急求助"}
          actionLabel="返回首页"
          onAction={() => router.push("/family")}
        />
      </div>
    );
  }

  return (
    <AlertBanner
      alert={alert}
      onRespond={handleRespond}
      onViewDetail={handleViewDetail}
    />
  );
}
