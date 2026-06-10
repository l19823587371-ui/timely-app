export interface BindingElder {
  elderId: string;
  elderName: string;
  relation: string;
  healthStatus: "normal" | "warning" | "danger";
  avatar: string;
  age: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  bindingElders: BindingElder[];
}
