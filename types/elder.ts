export interface EmergencyContact {
  level: 1 | 2 | 3;
  name: string;
  relation: string;
  phone: string;
  avatar: string;
}

export interface Elder {
  id: string;
  name: string;
  age: number;
  gender: "男" | "女";
  avatar: string;
  phone: string;
  address: string;
  location: { lat: number; lng: number };
  community: string;
  bloodType: "A" | "B" | "AB" | "O";
  allergies: string[];
  medicalHistory: string[];
  insuranceType: string;
  idCard: string;
  birthDate: string;
  emergencyContacts: EmergencyContact[];
  status: "normal" | "warning" | "danger";
}
