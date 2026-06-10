export type SOSAlertType = "emergency" | "sub_emergency" | "normal";
export type SOSStatus = "pending" | "accepted" | "rescuing" | "arrived" | "completed" | "cancelled";

export interface RescueStep {
  step: "alerted" | "accepted" | "rescuing" | "arrived" | "completed";
  label: string;
  time: string | null;
  done: boolean;
  note?: string;
}

export interface SOSRating {
  stars: number;
  tags: string[];
  comment: string;
  createdAt: string;
}

export interface SOSAlert {
  id: string;
  elderId: string;
  elderName: string;
  elderAge: number;
  type: SOSAlertType;
  status: SOSStatus;
  triggerTime: string;
  location: { lat: number; lng: number };
  address: string;
  rescueProgress: RescueStep[];
  assignedStaff?: { id: string; name: string; role: string };
  familyNotified: boolean;
  familyAccepted: boolean;
  videoUrl?: string;
  rating?: SOSRating;
}
