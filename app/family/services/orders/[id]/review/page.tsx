"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getServiceOrder, submitServiceReview } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Toast from "@/components/shared/Toast";
import type { ServiceOrder } from "@/types/service";

const reviewTags = ["很细心", "态度好", "速度快", "很专业", "很耐心", "很干净", "有礼貌", "技术好"];

export default function ServiceReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stars, setStars] = useState(0);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServiceOrder(id);
      if (!data) {
        setError("未找到该订单");
      } else if (data.status !== "completed") {
        setError("订单尚未完成，暂时无法评价");
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (stars === 0) {
      setToast({ message: "请先评分", type: "error" });
      return;
    }
    try {
      setSubmitting(true);
      await submitServiceReview(id, {
        stars,
        tags: selectedTags,
        comment,
        images: [],
        createdAt: new Date().toISOString(),
      });
      setToast({ message: "评价提交成功！", type: "success" });
      setTimeout(() => router.push(`/family/services/orders/${id}`), 1500);
    } catch {
      setToast({ message: "提交失败，请重试", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="服务评价" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="服务评价" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh] px-4">
          <EmptyState message={error || "未找到订单"} actionLabel="返回" onAction={() => router.back()} />
        </div>
      </div>
    );
  }

  const serviceLabels: Record<string, { label: string; icon: string }> = {
    cleaning: { label: "保洁服务", icon: "🧹" },
    escort: { label: "陪诊服务", icon: "🏥" },
    haircut: { label: "理发服务", icon: "✂️" },
  };
  const serviceInfo = serviceLabels[order.serviceType] || { label: "未知服务", icon: "📋" };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="服务评价" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6 space-y-4">
        {/* Service info */}
        <div className="bg-card rounded-family p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{serviceInfo.icon}</span>
            <div>
              <h2 className="font-family-h2 text-text-primary">{serviceInfo.label}</h2>
              <p className="font-family-caption text-text-disabled">订单号: {order.id}</p>
            </div>
          </div>
          {order.provider && (
            <p className="font-family-body text-text-secondary">
              服务人员: {order.provider.name} · ⭐ {order.provider.rating}
            </p>
          )}
        </div>

        {/* Star rating */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-4 text-center">为本次服务打分</h3>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setStars(star)}
                onMouseEnter={() => setHoveredStars(star)}
                onMouseLeave={() => setHoveredStars(0)}
                className="text-4xl transition-transform active:scale-110 hover:scale-110"
              >
                <span
                  className={
                    star <= (hoveredStars || stars) ? "text-warning" : "text-text-disabled"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          <p className="text-center mt-2 font-family-caption text-text-secondary">
            {stars === 0 ? "点击星星评分" : stars <= 2 ? "不满意" : stars === 3 ? "一般" : stars === 4 ? "满意" : "非常满意"}
          </p>
        </div>

        {/* Tag selection */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">选择评价标签</h3>
          <div className="flex flex-wrap gap-2">
            {reviewTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full font-family-caption transition-colors ${
                  selectedTags.includes(tag)
                    ? "bg-primary text-white"
                    : "bg-bg-warm text-text-secondary border border-border"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Text comment */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">写评价</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="分享您的体验..."
            className="w-full p-3 rounded-family border border-border bg-background font-family-body text-text-primary placeholder:text-text-disabled resize-none h-28"
          />
        </div>

        {/* Image upload placeholder */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">添加图片</h3>
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-family border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <svg className="w-8 h-8 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <p className="mt-2 font-family-caption text-text-disabled">支持 jpg/png，最多9张</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || stars === 0}
          className="w-full min-h-family-btn rounded-family bg-primary text-white font-family-body font-semibold active:scale-[0.98] transition-transform disabled:opacity-40 disabled:scale-100"
        >
          {submitting ? "提交中..." : "提交评价"}
        </button>
      </div>

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
