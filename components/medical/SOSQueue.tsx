"use client";

import { useState } from "react";
import type { SOSAlert } from "@/types/sos";

type TabType = "emergencies" | "subEmergencies" | "normals";

interface SOSQueueProps {
  queues: {
    emergencies: SOSAlert[];
    subEmergencies: SOSAlert[];
    normals: SOSAlert[];
  };
  onAccept: (alert: SOSAlert) => void;
}

const tabConfig = [
  { key: "emergencies" as TabType, label: "紧急", bgClass: "bg-danger", activeBg: "bg-danger text-white", countColor: "text-white", badgeClass: "bg-white/20" },
  { key: "subEmergencies" as TabType, label: "次紧急", bgClass: "bg-orange-50", activeBg: "bg-warning text-white", countColor: "text-white", badgeClass: "bg-white/20" },
  { key: "normals" as TabType, label: "普通", bgClass: "bg-gray-50", activeBg: "bg-gray-600 text-white", countColor: "text-white", badgeClass: "bg-white/20" },
];

export default function SOSQueue({ queues, onAccept }: SOSQueueProps) {
  const [activeTab, setActiveTab] = useState<TabType>("emergencies");

  const currentQueue = queues[activeTab];

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "--:--";
    }
  };

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabConfig.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = queues[tab.key].length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 text-medical-h2 font-medium transition-colors flex items-center justify-center gap-2 ${
                isActive ? tab.activeBg : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full text-medical-caption font-bold ${
                  isActive ? tab.badgeClass : (tab.key === "emergencies" ? "bg-danger text-white" : tab.key === "subEmergencies" ? "bg-warning text-white" : "bg-gray-500 text-white")
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Queue items */}
      <div className="divide-y divide-border">
        {currentQueue.length === 0 ? (
          <div className="py-12 text-center text-medical-body text-text-disabled">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-30">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
            暂无{tabConfig.find(t => t.key === activeTab)?.label}呼叫
          </div>
        ) : (
          currentQueue.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 hover:bg-background transition-colors ${
                activeTab === "emergencies" ? "border-l-4 border-l-danger" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-medical-h2 text-text-primary font-medium">{alert.elderName}</span>
                    <span className="text-medical-caption text-text-secondary">{alert.elderAge}岁</span>
                  </div>
                  <div className="flex items-center gap-3 text-medical-caption text-text-secondary">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M1 8a7 7 0 1114 0A7 7 0 011 8zm7.75-4.25a.75.75 0 00-1.5 0v3.5c0 .414.336.75.75.75h2.25a.75.75 0 000-1.5H8.75V3.75z" clipRule="evenodd" />
                      </svg>
                      {formatTime(alert.triggerTime)}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M8 1a3.5 3.5 0 00-3.5 3.5c0 1.53.678 2.844 1.576 4.004C7.228 9.74 8 10.5 8 10.5s.771-.76 1.924-1.996C10.822 8.344 11.5 7.03 11.5 4.5A3.5 3.5 0 008 1zM5 4.5a3 3 0 116 0c0 1.226-.557 2.31-1.324 3.303C8.846 8.88 8.08 9.69 8 9.77c-.08-.08-.846-.89-1.676-1.967C5.557 6.81 5 5.726 5 4.5z" clipRule="evenodd" />
                      </svg>
                      {alert.address.length > 18 ? alert.address.slice(0, 18) + "..." : alert.address}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onAccept(alert)}
                  className={`ml-4 px-4 py-2 rounded-medical text-medical-body font-medium text-white transition-colors min-w-medical-touch ${
                    activeTab === "emergencies"
                      ? "bg-danger hover:bg-red-600"
                      : activeTab === "subEmergencies"
                      ? "bg-warning hover:bg-yellow-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  接单
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
