"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Users, Phone, Clock } from "lucide-react";
import { getElderProfile, getLatestHealth } from "@/lib/api";
import { getGreeting, formatDate } from "@/lib/utils";
import { SOSButton } from "@/components/elder";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import type { Elder, HealthRecord } from "@/types";
import type { HealthStatus } from "@/types/health";

export default function ElderHomePage() {
  const router = useRouter();
  const [elder, setElder] = useState<Elder | null>(null);
  const [health, setHealth] = useState<Partial<HealthRecord> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [elderData, healthData] = await Promise.all([
        getElderProfile(),
        getLatestHealth("E001"),
      ]);
      setElder(elderData);
      setHealth(healthData);
    } catch {
      setError("加载失败，请下拉重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const today = new Date();
  const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const weekDays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dayStr = weekDays[today.getDay()];

  const gridCards = [
    { icon: Heart, title: "健康监测", desc: "查看血压、心率等健康指标", path: "/elder/health" },
    { icon: Users, title: "社区活动", desc: "参加太极、书法等文体活动", path: "/elder/activities" },
    { icon: Phone, title: "紧急联系人", desc: "子女、邻居等紧急联系方式", path: "/elder/contacts" },
    { icon: Clock, title: "历史记录", desc: "查看过往求助和健康报告", path: "/elder/sos" },
  ];

  if (error) {
    return (
      <div className="px-elder-px pt-6">
        <div className="bg-bg-alert text-danger rounded-elder p-4 text-elder-body text-center">
          <p>{error}</p>
          <button onClick={fetchData} className="mt-2 text-primary underline text-elder-caption">点击重试</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-elder-px pt-6 space-y-4">
        <div className="space-y-2">
          <div className="h-8 w-2/3 bg-border rounded-lg animate-pulse" />
          <div className="h-5 w-1/2 bg-border rounded-lg animate-pulse" />
        </div>
        <div className="flex justify-center py-8">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-border animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 sm:h-40 bg-border rounded-elder animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-elder-px pt-6 pb-4">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-elder-h1">{elder ? getGreeting(elder.name) : "早上好"}</h1>
        <p className="text-elder-caption text-text-secondary mt-1">
          {dateStr} {dayStr} · ☀️ 晴 26°C
        </p>
      </div>

      {/* SOS Button */}
      <div className="mb-8">
        <SOSButton
          size="sm"
          onLongPress={() => router.push("/elder/sos")}
        />
        <p className="text-center text-elder-caption text-text-secondary mt-3">
          长按1秒即可发起紧急求助
        </p>
      </div>

      {/* Health Summary */}
      {health && (
        <div className="bg-card rounded-elder p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-elder-caption text-text-secondary">今日健康摘要</p>
              <p className="text-elder-h2">
                血压 {health.bloodPressure?.systolic}/{health.bloodPressure?.diastolic} · 心率 {health.heartRate?.bpm}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {gridCards.map((card) => (
          <button
            key={card.path}
            onClick={() => router.push(card.path)}
            className="bg-card rounded-elder p-elder-px flex flex-col items-center justify-center text-center gap-3 min-h-[120px] transition-colors hover:bg-background active:scale-[0.98]"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <card.icon size={28} className="text-primary" />
            </div>
            <div>
              <p className="text-elder-h2">{card.title}</p>
              <p className="text-elder-caption text-text-secondary mt-1">{card.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
