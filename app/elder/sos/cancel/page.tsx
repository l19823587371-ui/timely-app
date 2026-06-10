"use client";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { LargeButton } from "@/components/elder";

export default function SOSCancelPage() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-card rounded-dialog p-8 max-w-sm w-full text-center">
        <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={40} className="text-warning" />
        </div>
        <h2 className="text-elder-h1 mb-3">确定取消求助？</h2>
        <p className="text-elder-body text-text-secondary mb-8">
          您即将取消本次紧急求助，确认要继续吗？
        </p>
        <div className="flex flex-col gap-3">
          <LargeButton
            variant="primary"
            fullWidth
            onClick={() => router.push("/elder")}
          >
            确认取消
          </LargeButton>
          <LargeButton
            variant="ghost"
            fullWidth
            onClick={() => router.push("/elder/sos")}
          >
            继续求助
          </LargeButton>
        </div>
      </div>
    </div>
  );
}
