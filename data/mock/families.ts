import type { FamilyMember } from "@/types/family";

export const mockFamilies: FamilyMember[] = [
  {
    id: "F001", name: "李明", phone: "139****1234",
    avatar: "/images/avatar_male.png",
    bindingElders: [
      { elderId: "E001", elderName: "张桂芳", relation: "母亲", healthStatus: "normal", avatar: "/images/elder_001.png", age: 72 },
      { elderId: "E002", elderName: "张建国", relation: "父亲", healthStatus: "warning", avatar: "/images/elder_002.png", age: 78 },
    ],
  },
  {
    id: "F002", name: "张丽", phone: "136****5678",
    avatar: "/images/avatar_female.png",
    bindingElders: [
      { elderId: "E001", elderName: "张桂芳", relation: "母亲", healthStatus: "normal", avatar: "/images/elder_001.png", age: 72 },
    ],
  },
];
