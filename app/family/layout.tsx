"use client";

import { usePathname } from "next/navigation";
import TabBar from "@/components/shared/TabBar";
import { FAMILY_TABBAR } from "@/lib/constants";
import { useEffect } from "react";
import { getNotifications } from "@/lib/api";
import { useNotificationStore } from "@/store/notificationStore";

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideTabs = pathname.includes("/alert/current");
  const { unreadCount, setNotifications } = useNotificationStore();

  useEffect(() => {
    getNotifications("F001").then(setNotifications);
  }, [setNotifications]);

  return (
    <div className="min-h-screen bg-background flex flex-col w-full max-w-screen-xl mx-auto">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-10">{children}</div>
      {!hideTabs && (
        <div className="md:hidden">
          <TabBar
            items={[...FAMILY_TABBAR]}
            currentPath={pathname}
            hasNotification={unreadCount > 0}
          />
        </div>
      )}
    </div>
  );
}
