"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HealthRecordCard from "@/components/medical/HealthRecordCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getElderRecords } from "@/lib/api";
import type { Elder } from "@/types/elder";

interface RecordsData {
  elder: Elder;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    status: string;
  }>;
  reports: Array<{
    date: string;
    title: string;
    url: string;
  }>;
}

export default function ElderRecordsPage() {
  const params = useParams();
  const [data, setData] = useState<RecordsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = params.id as string;
      const result = await getElderRecords(id);
      setData(result);
    } catch (e) {
      setError("加载健康档案失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  if (loading) return <LoadingSpinner message="加载健康档案..." />;

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-danger mb-4">{error}</p>
        <button
          onClick={loadData}
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

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-medical-h1 text-text-primary">健康档案</h1>
      <HealthRecordCard elder={data.elder} records={data} />
    </div>
  );
}
