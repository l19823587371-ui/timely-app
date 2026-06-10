"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/medical/SearchBar";
import { searchElders } from "@/lib/api";
import type { Elder } from "@/types/elder";

export default function ElderSearchPage() {
  const router = useRouter();
  const [elders, setElders] = useState<Elder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fetchElders = async (q?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await searchElders(q || undefined);
      setElders(result.elders);
    } catch (err) {
      setError("加载老人列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElders();
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    fetchElders(q);
  };

  const handleFilter = (filters: { community: string; age: string; status: string }) => {
    // Filtering handled by searchElders API in a real app; here we do client-side
    fetchElders(query);
  };

  const statusBadge = (status: Elder["status"]) => {
    const config: Record<string, string> = {
      normal: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      danger: "bg-danger/10 text-danger",
    };
    const labels: Record<string, string> = {
      normal: "正常",
      warning: "预警",
      danger: "危险",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-medical-caption font-medium ${config[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-medical-h1 text-text-primary">老人搜索</h1>
        <div className="bg-card rounded-medical p-8 text-center">
          <p className="text-medical-body text-danger mb-4">{error}</p>
          <button
            onClick={() => fetchElders(query)}
            className="px-4 py-2 rounded-medical bg-primary text-white text-medical-body"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-medical-h1 text-text-primary">老人搜索</h1>

      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-medical p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : elders.length === 0 ? (
        <div className="bg-card rounded-medical py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 text-text-disabled/30">
            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
          </svg>
          <p className="text-medical-body text-text-disabled">未找到匹配的老人</p>
          <p className="text-medical-caption text-text-disabled mt-1">尝试其他搜索条件</p>
        </div>
      ) : (
        <div className="space-y-3">
          {elders.map((elder) => (
            <div
              key={elder.id}
              className="bg-card rounded-medical p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                    {elder.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-medical-h2 text-text-primary font-medium">{elder.name}</span>
                      {statusBadge(elder.status)}
                    </div>
                    <div className="text-medical-caption text-text-secondary mt-0.5">
                      {elder.gender} · {elder.age}岁 · {elder.community} · {elder.bloodType}型血
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(`/medical/elders/${elder.id}/records`)}
                    className="px-3 py-1.5 rounded-medical border border-primary text-primary text-medical-caption hover:bg-primary/5 transition-colors"
                  >
                    查看档案
                  </button>
                  <button
                    onClick={() => router.push(`/medical/elders/${elder.id}/vitals`)}
                    className="px-3 py-1.5 rounded-medical bg-primary text-white text-medical-caption hover:bg-primary-dark transition-colors"
                  >
                    体征分析
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
