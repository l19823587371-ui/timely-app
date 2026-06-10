"use client";

import { useState } from "react";
import type { SOSAlert } from "@/types/sos";

interface RescueDecisionProps {
  alert: SOSAlert;
  onConfirm: () => void;
  onTransfer: () => void;
  estimatedETA?: string;
  distance?: string;
}

export default function RescueDecision({
  alert,
  onConfirm,
  onTransfer,
  estimatedETA = "约 5 分钟",
  distance = "约 1.2 公里",
}: RescueDecisionProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-card rounded-medical overflow-hidden">
      {/* Header */}
      <div className="bg-danger text-white px-5 py-4">
        <div className="text-medical-h2 font-bold">是否前往现场救援？</div>
        <div className="text-medical-caption opacity-80 mt-1">
          确认后将立即出发前往老人所在地
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Elder info */}
        <div className="flex items-center gap-3 bg-background rounded-medical p-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {alert.elderName.charAt(0)}
          </div>
          <div>
            <div className="text-medical-h2 text-text-primary">{alert.elderName}</div>
            <div className="text-medical-caption text-text-secondary">
              {alert.elderAge}岁 · {alert.address.slice(0, 20)}
            </div>
          </div>
        </div>

        {/* ETA and distance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-background rounded-medical p-4 text-center">
            <div className="text-medical-caption text-text-secondary">预计到达时间</div>
            <div className="text-medical-h1 text-primary mt-1">{estimatedETA}</div>
          </div>
          <div className="bg-background rounded-medical p-4 text-center">
            <div className="text-medical-caption text-text-secondary">距离</div>
            <div className="text-medical-h1 text-text-primary mt-1">{distance}</div>
          </div>
        </div>

        {/* Map toggle */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="w-full py-2.5 rounded-medical border border-primary text-primary text-medical-body hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M8.157 2.176a1.5 1.5 0 00-1.147 0l-4.084 1.69a1.5 1.5 0 00-.926 1.38v11.478a1.5 1.5 0 001.861 1.46l4.64-1.4 4.362 1.816a1.5 1.5 0 001.274 0l4.084-1.69a1.5 1.5 0 00.926-1.38V4.052a1.5 1.5 0 00-1.861-1.46L12.64 3.992l-4.483-1.816zM7.89 3.28l5.75 2.33v11.11l-5.75-2.33V3.28zm-1.5 0l-4.39 1.817v11.11l4.39-1.348v-11.58z" clipRule="evenodd" />
          </svg>
          {showMap ? "收起地图" : "查看地图导航"}
        </button>

        {showMap && (
          <div className="rounded-medical overflow-hidden bg-gray-200 h-48 flex items-center justify-center border border-border">
            <div className="text-center text-text-disabled">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-2 opacity-30">
                <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.678l-4.993 2.498a1.875 1.875 0 01-1.678 0l-4.993-2.498a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.678l4.875-2.437zM9 6a.75.75 0 01.75.75V17.25a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
              </svg>
              <div className="text-medical-caption">地图组件接入中</div>
              <div className="text-medical-caption">从 {alert.address} 出发</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onTransfer}
            className="py-3 rounded-medical border-2 border-gray-300 text-text-secondary text-medical-h2 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 min-h-medical-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04z" clipRule="evenodd" />
            </svg>
            转诊其他机构
          </button>
          <button
            onClick={onConfirm}
            className="py-3 rounded-medical bg-primary text-white text-medical-h2 font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 min-h-medical-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            确认前往救援
          </button>
        </div>

        {/* Transfer note */}
        <p className="text-medical-caption text-text-disabled text-center">
          若现场情况超出社区处置能力，可选择转诊
        </p>
      </div>
    </div>
  );
}
