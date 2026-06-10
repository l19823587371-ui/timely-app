"use client";

import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const timeStr = new Date(notification.publishedAt).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-3 p-4 cursor-pointer active:bg-gray-50 transition-colors ${
        !notification.read ? "bg-bg-warm" : "bg-card"
      }`}
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-bg-warm flex items-center justify-center text-xl flex-shrink-0">
        {notification.icon || "📌"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`font-family-body truncate ${!notification.read ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
            {notification.title}
          </h4>
          {/* Unread dot */}
          {!notification.read && (
            <span className="w-2 h-2 rounded-full bg-danger flex-shrink-0" />
          )}
        </div>
        <p className="mt-0.5 font-family-caption text-text-secondary line-clamp-2">
          {notification.content}
        </p>
        <span className="mt-1 inline-block font-family-caption text-text-disabled">{timeStr}</span>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 pt-3">
        <svg className="w-4 h-4 text-text-disabled" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
