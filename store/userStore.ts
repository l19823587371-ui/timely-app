"use client";
import { create } from "zustand";

interface UserState {
  selectedElderId: string;
  staffId: string;
  staffName: string;
  setSelectedElder: (id: string) => void;
  loginStaff: (id: string, name: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedElderId: "E001",
  staffId: "S010",
  staffName: "刘医生",
  setSelectedElder: (id) => set({ selectedElderId: id }),
  loginStaff: (id, name) => set({ staffId: id, staffName: name }),
}));
