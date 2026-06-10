"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getElderContacts } from "@/lib/api";
import { SOSButton } from "@/components/elder";
import { ContactCard } from "@/components/elder";
import AppHeader from "@/components/shared/AppHeader";
import { LoadingSpinner, EmptyState } from "@/components/shared";
import type { EmergencyContact } from "@/types/elder";

export default function SOSPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getElderContacts()
      .then(setContacts)
      .catch(() => setError("加载联系人失败"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AppHeader title="SOS 紧急求助" />

      <div className="px-elder-px py-6">
        {/* SOS Button */}
        <div className="mb-4">
          <SOSButton
            size="lg"
            onLongPress={() => router.push("/elder/sos/confirm")}
          />
        </div>
        <p className="text-center text-elder-caption text-text-secondary mb-8">
          长按按钮 1 秒即可求助
        </p>

        {/* Emergency Contacts */}
        <h2 className="text-elder-h2 text-text-primary mb-4">紧急联系人</h2>

        {loading && <LoadingSpinner size="md" />}

        {error && (
          <div className="bg-bg-alert text-danger rounded-elder p-4 text-elder-body text-center">
            {error}
          </div>
        )}

        {!loading && !error && contacts.length === 0 && (
          <EmptyState message="暂无紧急联系人" />
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {contacts.map((contact, i) => (
              <ContactCard
                key={i}
                contact={contact}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
