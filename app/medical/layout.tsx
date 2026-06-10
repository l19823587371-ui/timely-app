"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";

const navItems = [
  {
    section: "工作台",
    items: [
      { href: "/medical", label: "工作台概览", icon: "home" },
    ],
  },
  {
    section: "老人管理",
    items: [
      { href: "/medical/elders/search", label: "老人搜索", icon: "search" },
    ],
  },
  {
    section: "紧急响应",
    items: [
      { href: "/medical/sos/queue", label: "SOS呼叫队列", icon: "alert" },
    ],
  },
  {
    section: "监测",
    items: [
      { href: "/medical/monitoring", label: "异常监测", icon: "monitor" },
    ],
  },
  {
    section: "信息",
    items: [
      { href: "/medical/announcements", label: "公告通知", icon: "bell" },
    ],
  },
];

const iconMap: Record<string, JSX.Element> = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
  ),
  alert: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557L12 14.943a2 2 0 01-2 1.557z" clipRule="evenodd" />
    </svg>
  ),
  monitor: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path d="M15.5 2A1.5 1.5 0 0117 3.5v9a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 12.5v-9A1.5 1.5 0 014.5 2h11zM5.75 17.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5z" />
    </svg>
  ),
  bell: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557L12 14.943a2 2 0 01-2 1.557z" clipRule="evenodd" />
    </svg>
  ),
};

function MedicalNav({ mobileOpen, onMobileClose }: { mobileOpen: boolean; onMobileClose: () => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-border flex flex-col transition-all duration-300 z-50 ${
          collapsed ? "w-16" : "w-[220px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-border px-4">
          {!collapsed && (
            <span className="text-medical-h1 text-primary font-bold">及时医疗端</span>
          )}
          {collapsed && (
            <span className="text-xl text-primary font-bold">及</span>
          )}
        </div>

        {/* Toggle — desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border items-center justify-center text-text-secondary hover:text-primary transition-colors z-50 hidden lg:flex"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
              clipRule="evenodd"
            />
          </svg>
        </button>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((section) => (
          <div key={section.section} className="mb-4">
            {!collapsed && (
              <div className="px-4 mb-2">
                <span className="text-medical-caption text-text-disabled uppercase tracking-wider">
                  {section.section}
                </span>
              </div>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-medical transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-secondary hover:bg-background hover:text-text-primary"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  {iconMap[item.icon]}
                  {!collapsed && <span className="text-medical-body">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Staff info */}
      <StaffFooter collapsed={collapsed} />
    </aside>
    </>
  );
}

function StaffFooter({ collapsed }: { collapsed: boolean }) {
  const { staffName, staffId } = useUserStore();

  return (
    <div className="border-t border-border p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {staffName.charAt(0)}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-medical-caption text-text-primary font-medium truncate">
              {staffName}
            </div>
            <div className="text-[11px] text-text-disabled">ID: {staffId}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <MedicalNav mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-30 w-10 h-10 rounded-medical bg-card border border-border flex items-center justify-center text-text-primary lg:hidden shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      </button>
      {/* Main content */}
      <main className="transition-all duration-300 lg:ml-[220px]">
        <div className="p-4 px-4 sm:px-6 md:px-8 lg:px-10">{children}</div>
      </main>
    </div>
  );
}
