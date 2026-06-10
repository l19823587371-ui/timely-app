"use client";
import { create } from "zustand";
import type { SOSAlert, SOSRating } from "@/types/sos";

interface SOSState {
  longPressActive: boolean;
  countdownActive: boolean;
  countdownRemaining: number;
  activeAlert: SOSAlert | null;
  setLongPressActive: (v: boolean) => void;
  setCountdownActive: (v: boolean) => void;
  setCountdownRemaining: (v: number) => void;
  setActiveAlert: (alert: SOSAlert | null) => void;
  updateProgress: (steps: SOSAlert["rescueProgress"], status: SOSAlert["status"]) => void;
  submitRating: (rating: SOSRating) => void;
  reset: () => void;
}

export const useSOSStore = create<SOSState>((set, get) => ({
  longPressActive: false,
  countdownActive: false,
  countdownRemaining: 10,
  activeAlert: null,
  setLongPressActive: (v) => set({ longPressActive: v }),
  setCountdownActive: (v) => set({ countdownActive: v }),
  setCountdownRemaining: (v) => set({ countdownRemaining: v }),
  setActiveAlert: (alert) => set({ activeAlert: alert }),
  updateProgress: (steps, status) => {
    const alert = get().activeAlert;
    if (alert) set({ activeAlert: { ...alert, rescueProgress: steps, status } });
  },
  submitRating: (rating) => {
    const alert = get().activeAlert;
    if (alert) set({ activeAlert: { ...alert, rating, status: "completed" } });
  },
  reset: () => set({ longPressActive: false, countdownActive: false, countdownRemaining: 10, activeAlert: null }),
}));
