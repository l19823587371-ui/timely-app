"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSOSVideo } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import VideoPlayer from "@/components/family/VideoPlayer";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";

interface VideoData {
  videoUrl: string;
  events: Array<{ time: string; label: string }>;
}

export default function AlertVideoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSOSVideo(id);
      setVideoData(data);
    } catch {
      setError("加载视频失败，请重试");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="视频回放" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="视频回放" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh] px-4">
          <EmptyState message={error || "未找到视频"} actionLabel="重试" onAction={fetchVideo} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="视频回放" onBack={() => router.back()} />

      <div className="px-family-px pt-4 pb-6 space-y-4">
        {/* Video player */}
        <VideoPlayer videoUrl={videoData.videoUrl} events={videoData.events} />

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="flex-1 min-h-family-btn rounded-family border border-primary text-primary font-family-body flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载视频
          </button>
          <button className="flex-1 min-h-family-btn rounded-family bg-primary text-white font-family-body flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            分享视频
          </button>
        </div>
      </div>
    </div>
  );
}
