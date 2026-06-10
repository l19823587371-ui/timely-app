"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFamilyProfile, getFamilyBindings } from "@/lib/api";
import AppHeader from "@/components/shared/AppHeader";
import FamilyMemberCard from "@/components/family/FamilyMemberCard";
import Modal from "@/components/shared/Modal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import type { FamilyMember, BindingElder } from "@/types/family";

export default function FamilyProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<FamilyMember | null>(null);
  const [bindings, setBindings] = useState<BindingElder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const familyId = "F001";
      const [profileData, bindingsData] = await Promise.all([
        getFamilyProfile(familyId),
        getFamilyBindings(familyId),
      ]);
      setProfile(profileData);
      setBindings(bindingsData);
    } catch {
      setError("加载失败，请重试");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const settings = [
    { icon: "👨‍👩‍👦", label: "绑定父母", description: "添加或管理绑定的长者", onClick: () => router.push("/family") },
    { icon: "ℹ️", label: "关于及时APP", description: "版本 v2.0.0", onClick: () => {} },
    { icon: "🚪", label: "退出登录", description: "", onClick: () => setShowLogoutModal(true), danger: true },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="我的" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh]"><LoadingSpinner /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="我的" onBack={() => router.back()} />
        <div className="flex items-center justify-center h-[60vh] px-4">
          <EmptyState message={error} actionLabel="重试" onAction={fetchProfile} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="我的" onBack={() => router.back()} />

      <div className="px-family-px pt-6 pb-6 space-y-4">
        {/* Avatar & name */}
        <div className="bg-card rounded-family p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-bg-warm flex items-center justify-center overflow-hidden mb-3">
            {profile?.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-family-h1 text-text-disabled text-2xl">{profile?.name?.[0] || "?"}</span>
            )}
          </div>
          <h2 className="font-family-h1 text-text-primary">{profile?.name || "用户"}</h2>
          <p className="font-family-caption text-text-secondary mt-1">{profile?.phone || ""}</p>
        </div>

        {/* Bound elders */}
        <div className="bg-card rounded-family p-4">
          <h3 className="font-family-h2 text-text-primary mb-3">绑定的家人</h3>
          {bindings.length === 0 ? (
            <p className="font-family-caption text-text-disabled text-center py-4">暂未绑定</p>
          ) : (
            <div className="space-y-2">
              {bindings.map((elder) => (
                <FamilyMemberCard
                  key={elder.elderId}
                  elder={elder}
                  selected={false}
                  onSelect={() => router.push(`/family`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-card rounded-family overflow-hidden">
          {settings.map((setting, idx) => (
            <button
              key={setting.label}
              onClick={setting.onClick}
              className={`w-full flex items-center gap-3 p-4 text-left active:bg-gray-50 transition-colors ${
                idx < settings.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-xl">{setting.icon}</span>
              <div className="flex-1">
                <p
                  className={`font-family-body ${setting.danger ? "text-danger" : "text-text-primary"}`}
                >
                  {setting.label}
                </p>
                {setting.description && (
                  <p className="font-family-caption text-text-disabled">{setting.description}</p>
                )}
              </div>
              <svg className="w-4 h-4 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Logout modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="退出登录"
      >
        <div className="p-4">
          <p className="font-family-body text-text-secondary mb-4">
            确定要退出登录吗？
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 min-h-family-btn rounded-family border border-border text-text-secondary font-family-body active:scale-[0.98] transition-transform"
            >
              取消
            </button>
            <button
              onClick={() => {
                setShowLogoutModal(false);
                router.push("/");
              }}
              className="flex-1 min-h-family-btn rounded-family bg-danger text-white font-family-body font-semibold active:scale-[0.98] transition-transform"
            >
              确认退出
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
