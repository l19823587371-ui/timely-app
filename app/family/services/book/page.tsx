"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createServiceOrder } from "@/lib/api";
import { useUserStore } from "@/store/userStore";
import AppHeader from "@/components/shared/AppHeader";
import ServiceCard from "@/components/family/ServiceCard";
import Modal from "@/components/shared/Modal";
import Toast from "@/components/shared/Toast";
import type { ServiceType } from "@/types/service";

export default function ServiceBookPage() {
  const router = useRouter();
  const { selectedElderId } = useUserStore();

  const [selectedType, setSelectedType] = useState<ServiceType | null>(null);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const services = [
    { type: "cleaning" as ServiceType, icon: "🧹", label: "保洁服务", description: "专业保洁人员上门打扫，让家居焕然一新", price: 120 },
    { type: "escort" as ServiceType, icon: "🏥", label: "陪诊服务", description: "专人陪同就医，挂号、取药全程陪伴", price: 150 },
    { type: "haircut" as ServiceType, icon: "✂️", label: "理发服务", description: "专业理发师上门服务，足不出户享受理发", price: 60 },
  ];

  const selectedService = services.find((s) => s.type === selectedType);

  const isValid = selectedType && scheduledDate && scheduledTime;

  const handleSubmit = async () => {
    if (!isValid || !selectedService) return;
    try {
      setSubmitting(true);
      const scheduledTimeStr = `${scheduledDate}T${scheduledTime}:00+08:00`;
      const result = await createServiceOrder({
        familyId: "F001",
        elderId: selectedElderId,
        elderName: "张桂芳",
        serviceType: selectedType,
        scheduledTime: scheduledTimeStr,
        address: "北京市朝阳区阳光社区 3 号楼 201 室",
        notes,
        price: selectedService?.price ?? 0,
      });
      setToast({ message: "预约成功！", type: "success" });
      setShowModal(false);
      setTimeout(() => router.push(`/family/services/orders/${result.orderId}`), 1500);
    } catch {
      setToast({ message: "预约失败，请重试", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Generate date options for next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  });

  const timeOptions = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="服务预约" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6 space-y-4">
        <h2 className="font-family-h1 text-text-primary">选择服务类型</h2>

        {/* Service cards */}
        <div className="space-y-3">
          {services.map((service) => (
            <ServiceCard
              key={service.type}
              type={service.type}
              icon={service.icon}
              label={service.label}
              description={service.description}
              price={service.price}
              selected={selectedType === service.type}
              onSelect={() => setSelectedType(service.type)}
            />
          ))}
        </div>

        {/* Date & time selection */}
        {selectedType && (
          <div className="bg-card rounded-family p-4 space-y-4">
            <h3 className="font-family-h2 text-text-primary">选择时间</h3>

            {/* Date picker */}
            <div>
              <label className="font-family-caption text-text-secondary mb-2 block">日期</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-2">
                {dateOptions.map((date) => {
                  const d = new Date(date);
                  const isToday = dateOptions.indexOf(date) === 0;
                  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
                  return (
                    <button
                      key={date}
                      onClick={() => setScheduledDate(date)}
                      className={`py-2 rounded-family font-family-caption transition-colors ${
                        scheduledDate === date
                          ? "bg-primary text-white"
                          : "bg-bg-warm text-text-secondary hover:bg-primary/10"
                      }`}
                    >
                      <div className="text-xs">
                        {isToday ? "明天" : `${d.getMonth() + 1}/${d.getDate()}`}
                      </div>
                      <div className="text-xs mt-0.5 opacity-70">
                        周{dayNames[d.getDay()]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time picker */}
            <div>
              <label className="font-family-caption text-text-secondary mb-2 block">时段</label>
              <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    onClick={() => setScheduledTime(time)}
                    className={`py-2 rounded-family font-family-caption transition-colors ${
                      scheduledTime === time
                        ? "bg-primary text-white"
                        : "bg-bg-warm text-text-secondary hover:bg-primary/10"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-family-caption text-text-secondary mb-2 block">备注（选填）</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例如：需要重点打扫厨房..."
                className="w-full p-3 rounded-family border border-border bg-background font-family-body text-text-primary placeholder:text-text-disabled resize-none h-20"
              />
            </div>

            {/* Price summary & submit */}
            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="font-family-body text-text-secondary">预估费用</span>
                <span className="font-family-h2 text-primary">¥{selectedService?.price ?? 0}</span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                disabled={!isValid}
                className="w-full min-h-family-btn rounded-family bg-primary text-white font-family-body font-semibold active:scale-[0.98] transition-transform disabled:opacity-40 disabled:scale-100"
              >
                确认预约
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="确认预约"
      >
        <div className="p-4">
          {selectedService && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">{selectedService.icon}</span>
                <h3 className="font-family-h2 text-text-primary">{selectedService.label}</h3>
              </div>
              <p className="font-family-body text-text-secondary">
                📅 {scheduledDate} {scheduledTime}
              </p>
              <p className="font-family-body text-text-secondary">
                📍 北京市朝阳区阳光社区 3 号楼 201 室
              </p>
              {notes && (
                <p className="font-family-body text-text-secondary">📝 {notes}</p>
              )}
              <div className="pt-2 border-t border-border mt-2 flex justify-between">
                <span className="font-family-body text-text-primary">预计费用</span>
                <span className="font-family-h2 text-primary">¥{selectedService?.price ?? 0}</span>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 min-h-family-btn rounded-family border border-border text-text-secondary font-family-body active:scale-[0.98] transition-transform"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 min-h-family-btn rounded-family bg-primary text-white font-family-body font-semibold active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {submitting ? "提交中..." : "确认下单"}
            </button>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast visible={true}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
