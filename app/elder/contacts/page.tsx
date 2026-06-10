"use client";
import { useState, useEffect } from "react";
import { getElderContacts } from "@/lib/api";
import { ContactCard } from "@/components/elder";
import { LoadingSpinner, EmptyState, Modal, Toast } from "@/components/shared";
import type { ToastType } from "@/components/shared/Toast";
import { Plus, Phone } from "lucide-react";
import type { EmergencyContact } from "@/types/elder";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callModal, setCallModal] = useState<EmergencyContact | null>(null);
  const [toast, setToast] = useState<{visible: boolean; message: string; type: ToastType}>({ visible: false, message: "", type: "success" });

  useEffect(() => {
    getElderContacts()
      .then(setContacts)
      .catch(() => setError("加载联系人失败"))
      .finally(() => setLoading(false));
  }, []);

  const handleCall = (contact: EmergencyContact) => {
    setCallModal(contact);
  };

  const confirmCall = () => {
    if (!callModal) return;
    setCallModal(null);
    setToast({ visible: true, message: `正在呼叫 ${callModal.name}...`, type: "info" });
  };

  return (
    <div className="px-elder-px py-6 pb-4">
      <h1 className="text-elder-h1 mb-1">紧急联系人</h1>
      <p className="text-elder-caption text-text-secondary mb-6">紧急情况下可快速联系家人</p>

      {loading && <LoadingSpinner size="md" />}

      {error && (
        <div className="bg-bg-alert text-danger rounded-elder p-4 text-elder-body text-center">{error}</div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <EmptyState message="暂无紧急联系人" />
      )}

      {!loading && !error && contacts.length > 0 && (
        <div className="space-y-3">
          {contacts.map((contact, i) => (
            <ContactCard
              key={i}
              contact={contact}
              onCall={handleCall}
            />
          ))}
        </div>
      )}

      {/* Add Contact Button */}
      <button className="w-full min-h-elder-btn rounded-[12px] border-2 border-dashed border-border text-elder-body text-text-disabled flex items-center justify-center gap-2 mt-4 hover:border-primary hover:text-primary transition-colors">
        <Plus size={24} />
        <span>添加联系人</span>
      </button>

      {/* Call Confirm Modal */}
      {callModal && (
        <Modal
          open={!!callModal}
          onClose={() => setCallModal(null)}
          title="确认拨打电话"
          showCloseButton
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Phone size={36} className="text-primary" />
              </div>
              <p className="text-elder-h2">{callModal.name}</p>
              <p className="text-elder-caption text-text-secondary mt-1">{callModal.phone}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCallModal(null)}
                className="flex-1 min-h-elder-btn rounded-[12px] text-elder-body font-bold border-2 border-border text-text-secondary bg-card hover:bg-background"
              >
                取消
              </button>
              <button
                onClick={confirmCall}
                className="flex-1 min-h-elder-btn rounded-[12px] text-elder-body font-bold bg-primary text-white hover:bg-primary-dark"
              >
                确认拨打
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
}
