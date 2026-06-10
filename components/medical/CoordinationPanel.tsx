"use client";

import { useState } from "react";

interface CoordinationTarget {
  id: string;
  name: string;
  icon: JSX.Element;
  notified: boolean;
}

interface CoordinationPanelProps {
  alertId: string;
  onNotify: (targetId: string) => void;
  onNotifyAll: () => void;
}

const defaultTargets: CoordinationTarget[] = [
  {
    id: "community",
    name: "社区",
    notified: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    ),
  },
  {
    id: "emergency",
    name: "院内急诊",
    notified: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "family",
    name: "家属",
    notified: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
      </svg>
    ),
  },
  {
    id: "120",
    name: "120",
    notified: false,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
      </svg>
    ),
  },
];

export default function CoordinationPanel({
  alertId,
  onNotify,
  onNotifyAll,
}: CoordinationPanelProps) {
  const [targets, setTargets] = useState<CoordinationTarget[]>(defaultTargets);
  const [notifyingIds, setNotifyingIds] = useState<Set<string>>(new Set());

  const handleNotify = async (targetId: string) => {
    setNotifyingIds((prev) => new Set(prev).add(targetId));
    await onNotify(targetId);
    setTargets((prev) =>
      prev.map((t) => (t.id === targetId ? { ...t, notified: true } : t))
    );
    setNotifyingIds((prev) => {
      const next = new Set(prev);
      next.delete(targetId);
      return next;
    });
  };

  const handleNotifyAll = async () => {
    const ids = targets.filter((t) => !t.notified).map((t) => t.id);
    if (ids.length === 0) return;
    setNotifyingIds(new Set(ids));
    await onNotifyAll();
    setTargets((prev) => prev.map((t) => ({ ...t, notified: true })));
    setNotifyingIds(new Set());
  };

  const allNotified = targets.every((t) => t.notified);
  const pendingCount = targets.filter((t) => !t.notified).length;

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-medical-h2 text-text-primary font-bold">协同通知</h3>
          <p className="text-medical-caption text-text-secondary mt-0.5">
            {allNotified ? "所有目标已通知" : `还有 ${pendingCount} 个目标待通知`}
          </p>
        </div>
        <span className="text-medical-caption text-text-disabled">ID: {alertId}</span>
      </div>

      {/* Target cards */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 gap-3">
        {targets.map((target) => (
          <div
            key={target.id}
            className={`rounded-medical border p-4 flex items-center gap-4 transition-colors ${
              target.notified
                ? "border-success/30 bg-success/5"
                : "border-border bg-background hover:border-primary/30"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                target.notified ? "bg-success/10 text-success" : "bg-gray-100 text-text-secondary"
              }`}
            >
              {target.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-medical-h2 text-text-primary font-medium">{target.name}</div>
              <div className="text-medical-caption">
                {target.notified ? (
                  <span className="text-success">已通知</span>
                ) : (
                  <span className="text-text-disabled">待通知</span>
                )}
              </div>
            </div>
            {!target.notified && (
              <button
                onClick={() => handleNotify(target.id)}
                disabled={notifyingIds.has(target.id)}
                className="px-4 py-1.5 rounded-medical bg-primary text-white text-medical-caption font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {notifyingIds.has(target.id) ? "通知中..." : "通知"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Notify all */}
      <div className="px-5 pb-5">
        <button
          onClick={handleNotifyAll}
          disabled={allNotified || notifyingIds.size > 0}
          className="w-full py-3 rounded-medical bg-primary text-white text-medical-h2 font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-medical-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M3.105 2.288a.75.75 0 00-.826.95l1.414 4.926A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.288z" />
          </svg>
          一键全部通知
        </button>
      </div>
    </div>
  );
}
