"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSOSAlert, submitSOSRating } from "@/lib/api";
import { AppHeader, StarRating, TagGroup, Toast } from "@/components/shared";
import { LargeButton } from "@/components/elder";
import { LoadingSpinner } from "@/components/shared";
import type { SOSAlert } from "@/types/sos";

const RATING_TAGS = ["态度好", "速度快", "很专业", "很耐心", "很细心"];


function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const alertId = searchParams.get("alertId") || "SOS002";

  const [alert, setAlert] = useState<SOSAlert | null>(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{visible: boolean; message: string; type: "success" | "error" | "info"}>({ visible: false, message: "", type: "success" });

  useEffect(() => {
    getSOSAlert(alertId)
      .then(setAlert)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [alertId]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitSOSRating(alertId, {
        stars,
        tags: selectedTags,
        comment,
        createdAt: new Date().toISOString(),
      });
      setToast({ visible: true, message: "评价提交成功！", type: "success" });
      setTimeout(() => router.push("/elder"), 1500);
    } catch {
      setToast({ visible: true, message: "提交失败，请重试", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-20" />;

  return (
    <>
      <AppHeader title="服务评价" />

      <div className="px-elder-px py-6 space-y-6">
        {/* Staff Info */}
        {alert?.assignedStaff && (
          <div className="bg-card rounded-elder p-elder-px text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-elder-h1 text-primary">{alert.assignedStaff.name[0]}</span>
            </div>
            <p className="text-elder-h2">{alert.assignedStaff.name}</p>
            <p className="text-elder-caption text-text-secondary">{alert.assignedStaff.role}</p>
          </div>
        )}

        {/* Stars */}
        <div className="text-center">
          <p className="text-elder-h2 mb-4">请为本次服务评分</p>
          <StarRating
            value={stars}
            onChange={setStars}
            size={40}
          />
        </div>

        {/* Tags */}
        <div>
          <p className="text-elder-body text-text-primary mb-3">服务标签</p>
          <TagGroup
            tags={RATING_TAGS}
            selected={selectedTags}
            onChange={() => {}}
          />
        </div>

        {/* Comment */}
        <div>
          <p className="text-elder-body text-text-primary mb-3">补充评价</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="写下您对此次服务的感受..."
            className="w-full h-[120px] rounded-elder border-2 border-border p-4 text-elder-body resize-none focus:outline-none focus:border-primary bg-card"
          />
        </div>

        {/* Submit */}
        <LargeButton
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "提交中..." : "提交评价"}
        </LargeButton>
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-text-secondary">加载中...</p></div>}>
      <PageContent />
    </Suspense>
  );
}
