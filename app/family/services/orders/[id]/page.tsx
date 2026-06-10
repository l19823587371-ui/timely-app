"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServiceOrder } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import OrderStatusSteps from "@/components/family/OrderStatusSteps";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { ServiceOrder } from "@/types/service";

export default function ServiceOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServiceOrder(id);
      if (!data) {
        setError("未找到该订单");
      } else {
        setOrder(data);
      }
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const serviceLabels: Record<string, { label: string; icon: string }> = {
    cleaning: { label: "保洁服务", icon: "🧹" },
    escort: { label: "陪诊服务", icon: "🏥" },
    haircut: { label: "理发服务", icon: "✂️" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="订单详情" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="订单详情" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh] px-4">
          <EmptyState message={error || "未找到订单"} actionLabel="重试" onAction={fetchOrder} />
        </div>
      </div>
    );
  }

  const serviceInfo = serviceLabels[order.serviceType] || { label: "未知服务", icon: "📋" };
  const scheduledDate = new Date(order.scheduledTime).toLocaleString("zh-CN", {
    month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const isCompleted = order.status === "completed";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="订单详情" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6 space-y-4">
        {/* Order header */}
        <div className="bg-card rounded-family p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{serviceInfo.icon}</span>
            <div>
              <h2 className="font-family-h2 text-text-primary">{serviceInfo.label}</h2>
              <p className="font-family-caption text-text-disabled">订单号: {order.id}</p>
            </div>
          </div>
          <div className="bg-bg-warm rounded-family p-3 space-y-1 font-family-body">
            <div className="flex justify-between">
              <span className="text-text-secondary">长者</span>
              <span className="text-text-primary">{order.elderName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">预约时间</span>
              <span className="text-text-primary">{scheduledDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">地址</span>
              <span className="text-text-primary text-right max-w-[60%]">{order.address}</span>
            </div>
            {order.notes && (
              <div className="flex justify-between">
                <span className="text-text-secondary">备注</span>
                <span className="text-text-primary text-right max-w-[60%]">{order.notes}</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-border">
              <span className="text-text-secondary">费用</span>
              <span className="font-family-h2 text-primary">¥{order.price}</span>
            </div>
          </div>
        </div>

        {/* Status steps */}
        <OrderStatusSteps order={order} />

        {/* Provider info */}
        {order.provider && (
          <div className="bg-card rounded-family p-4">
            <h3 className="font-family-h2 text-text-primary mb-3">服务人员</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bg-warm flex items-center justify-center overflow-hidden">
                {order.provider.avatar ? (
                  <img src={order.provider.avatar} alt={order.provider.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-family-h2 text-text-disabled">{order.provider.name[0]}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-family-body text-text-primary font-semibold">{order.provider.name}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-family-caption text-warning">⭐ {order.provider.rating}</span>
                  <span className="font-family-caption text-text-secondary">📞 {order.provider.phone}</span>
                </div>
              </div>
              <a
                href={`tel:${order.provider.phone}`}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">服务位置</h3>
          <div className="bg-gray-100 rounded-family h-40 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl">📍</span>
              <p className="mt-1 font-family-caption text-text-disabled">{order.address}</p>
            </div>
          </div>
        </div>

        {/* Review button for completed */}
        {isCompleted && !order.review && (
          <button
            onClick={() => router.push(`/family/services/orders/${order.id}/review`)}
            className="w-full min-h-family-btn rounded-family bg-primary text-white font-family-body font-semibold active:scale-[0.98] transition-transform"
          >
            ✍️ 去评价
          </button>
        )}

        {isCompleted && order.review && (
          <div className="bg-card rounded-family p-4">
            <h3 className="font-family-h2 text-text-primary mb-3">我的评价</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-lg ${star <= order.review!.stars ? "text-warning" : "text-text-disabled"}`}>
                  ★
                </span>
              ))}
            </div>
            <p className="font-family-body text-text-secondary">{order.review.comment}</p>
            {order.review.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {order.review.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-bg-warm text-primary font-family-caption">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
