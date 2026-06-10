import Link from "next/link";

const entries = [
  {
    title: "老人端",
    description: "大按钮 SOS · 健康监测 · 社区活动",
    href: "/elder",
    icon: "🧓",
    color: "#F28C28",
  },
  {
    title: "家属端",
    description: "远程监护 · 警报接收 · 服务预约",
    href: "/family",
    icon: "👨‍👩‍👧",
    color: "#F28C28",
  },
  {
    title: "医护端",
    description: "工作台 · SOS 接单 · 救援调度",
    href: "/medical",
    icon: "👨‍⚕️",
    color: "#F28C28",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "#FAF7F2" }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#333333" }}>
          及时 APP
        </h1>
        <p className="text-base" style={{ color: "#666666" }}>
          智慧养老紧急响应平台
        </p>
      </div>

      {/* Entry Cards */}
      <div className="w-full max-w-sm space-y-4">
        {entries.map((entry) => (
          <Link key={entry.href} href={entry.href}>
            <div
              className="rounded-2xl p-6 shadow-md cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: `${entry.color}15` }}
                >
                  {entry.icon}
                </div>
                <div className="flex-1">
                  <h2
                    className="text-xl font-bold mb-1"
                    style={{ color: "#333333" }}
                  >
                    {entry.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#666666" }}
                  >
                    {entry.description}
                  </p>
                </div>
                <div className="text-xl" style={{ color: "#F28C28" }}>
                  →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs" style={{ color: "#BBBBBB" }}>
        及时响应，安心守护
      </p>
    </div>
  );
}
