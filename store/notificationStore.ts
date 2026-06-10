"use client";
import { create } from "zustand";
import type { Notification } from "@/types/notification";

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  setNotifications: (list: Notification[]) => void;
  markAsRead: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  notifications: [],
  setNotifications: (list) => set({ notifications: list, unreadCount: list.filter((n) => !n.read).length }),
  markAsRead: (id) => {
    const notifications = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
  },
}));
