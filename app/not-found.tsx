import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-5">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold text-primary mb-2">404</h1>
      <p className="text-secondary mb-6">页面未找到</p>
      <Link
        href="/elder"
        className="btn-primary px-8 py-3 rounded-lg text-white font-bold"
      >
        返回首页
      </Link>
    </div>
  );
}
