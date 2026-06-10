"use client";

import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { community: string; age: string; status: string }) => void;
  communities?: string[];
}

export default function SearchBar({
  onSearch,
  onFilter,
  communities = ["全部", "阳光社区", "绿叶社区", "金色社区"],
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [community, setCommunity] = useState("全部");
  const [age, setAge] = useState("全部");
  const [status, setStatus] = useState("全部");

  const handleSearch = () => {
    onSearch(query);
    onFilter({ community, age, status });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-card rounded-medical p-4 space-y-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-disabled"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="搜索老人姓名、社区..."
            className="w-full pl-10 pr-4 py-2 rounded-medical border border-border bg-background text-medical-body text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-primary text-white rounded-medical text-medical-body font-medium hover:bg-primary-dark transition-colors min-w-medical-touch"
        >
          搜索
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        {/* Community filter */}
        <div className="flex items-center gap-2">
          <label className="text-medical-caption text-text-secondary whitespace-nowrap">社区</label>
          <select
            value={community}
            onChange={(e) => {
              setCommunity(e.target.value);
              onFilter({ community: e.target.value, age, status });
            }}
            className="px-3 py-1.5 rounded-medical border border-border bg-background text-medical-caption text-text-primary focus:outline-none focus:border-primary"
          >
            {communities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Age filter */}
        <div className="flex items-center gap-2">
          <label className="text-medical-caption text-text-secondary whitespace-nowrap">年龄</label>
          <select
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              onFilter({ community, age: e.target.value, status });
            }}
            className="px-3 py-1.5 rounded-medical border border-border bg-background text-medical-caption text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="全部">全部</option>
            <option value="60-70">60-70岁</option>
            <option value="71-80">71-80岁</option>
            <option value="81+">81岁以上</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <label className="text-medical-caption text-text-secondary whitespace-nowrap">状态</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              onFilter({ community, age, status: e.target.value });
            }}
            className="px-3 py-1.5 rounded-medical border border-border bg-background text-medical-caption text-text-primary focus:outline-none focus:border-primary"
          >
            <option value="全部">全部</option>
            <option value="normal">正常</option>
            <option value="warning">预警</option>
            <option value="danger">危险</option>
          </select>
        </div>

        {(community !== "全部" || age !== "全部" || status !== "全部") && (
          <button
            onClick={() => {
              setCommunity("全部");
              setAge("全部");
              setStatus("全部");
              onFilter({ community: "全部", age: "全部", status: "全部" });
            }}
            className="px-3 py-1.5 text-medical-caption text-primary hover:underline"
          >
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
