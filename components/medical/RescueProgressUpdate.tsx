"use client";

import { useState } from "react";
import type { RescueStep } from "@/types/sos";

interface RescueProgressUpdateProps {
  steps: RescueStep[];
  onUpdate: (step: string, time: string, note: string) => void;
}

const stepIcons: Record<string, JSX.Element> = {
  alerted: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
    </svg>
  ),
  accepted: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
  rescuing: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M3.105 2.288a.75.75 0 00-.826.95l1.414 4.926A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.288z" />
    </svg>
  ),
  arrived: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
  ),
  completed: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  ),
};

export default function RescueProgressUpdate({ steps, onUpdate }: RescueProgressUpdateProps) {
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [editingTime, setEditingTime] = useState("");
  const [editingNote, setEditingNote] = useState("");

  const startEdit = (step: RescueStep) => {
    setEditingStep(step.step);
    setEditingTime(step.time || new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }));
    setEditingNote(step.note || "");
  };

  const saveStep = (step: string) => {
    onUpdate(step, editingTime, editingNote);
    setEditingStep(null);
  };

  const cancelEdit = () => {
    setEditingStep(null);
  };

  const completedCount = steps.filter((s) => s.done).length;
  const totalSteps = steps.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Progress header */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-medical-h2 text-text-primary font-bold">救援进度</span>
          <span className="text-medical-caption text-text-secondary">
            {completedCount}/{totalSteps} 步完成
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="p-5">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-border" />

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isDone = step.done;
              const isEditing = editingStep === step.step;
              const isCurrent = !isDone && steps.slice(0, index).every((s) => s.done);

              return (
                <div key={step.step} className="relative flex gap-4">
                  {/* Dot */}
                  <div
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isDone
                        ? "bg-success text-white"
                        : isCurrent
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-text-disabled"
                    }`}
                  >
                    {stepIcons[step.step] || null}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-medical-h2 font-medium ${
                          isDone ? "text-success" : isCurrent ? "text-primary" : "text-text-disabled"
                        }`}
                      >
                        {step.label}
                      </span>
                      {step.time && (
                        <span className="text-medical-caption text-text-secondary">{step.time}</span>
                      )}
                    </div>

                    {step.note && !isEditing && (
                      <p className="text-medical-caption text-text-secondary mt-1">{step.note}</p>
                    )}

                    {!isDone && !isEditing && isCurrent && (
                      <button
                        onClick={() => startEdit(step)}
                        className="mt-2 text-medical-caption text-primary hover:underline"
                      >
                        标记完成 & 添加备注
                      </button>
                    )}

                    {isEditing && (
                      <div className="mt-2 space-y-2 bg-background rounded-medical p-3">
                        <div className="flex items-center gap-2">
                          <label className="text-medical-caption text-text-secondary">时间</label>
                          <input
                            type="text"
                            value={editingTime}
                            onChange={(e) => setEditingTime(e.target.value)}
                            placeholder="HH:MM"
                            className="px-2 py-1 rounded border border-border text-medical-caption text-text-primary w-24 focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="text-medical-caption text-text-secondary block mb-1">备注</label>
                          <textarea
                            value={editingNote}
                            onChange={(e) => setEditingNote(e.target.value)}
                            placeholder="输入现场情况备注..."
                            rows={2}
                            className="w-full px-3 py-2 rounded border border-border text-medical-caption text-text-primary resize-none focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveStep(step.step)}
                            className="px-4 py-1.5 rounded-medical bg-primary text-white text-medical-caption font-medium hover:bg-primary-dark transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-1.5 rounded-medical border border-border text-medical-caption text-text-secondary hover:bg-gray-50 transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
