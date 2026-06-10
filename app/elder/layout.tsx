"use client";

import TabBar from "@/components/shared/TabBar";
import { ELDER_TABBAR } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function ElderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex flex-col w-full max-w-screen-xl mx-auto">
      <div className="flex-1 overflow-y-auto pb-4 px-4 sm:px-6 md:px-8 lg:px-10">{children}</div>
      <div className="md:hidden">
        <TabBar items={[...ELDER_TABBAR]} currentPath={pathname} />
      </div>
    </div>
  );
}
