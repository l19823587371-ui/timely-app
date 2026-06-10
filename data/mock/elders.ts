import type { Elder } from "@/types/elder";

export const mockElders: Elder[] = [
  {
    id: "E001", name: "张桂芳", age: 72, gender: "女",
    avatar: "/images/elder_001.png", phone: "138****6789",
    address: "北京市朝阳区阳光社区 3 号楼 201 室",
    location: { lat: 39.9219, lng: 116.4435 },
    community: "阳光社区", bloodType: "A",
    allergies: ["青霉素", "头孢类"],
    medicalHistory: ["高血压", "2型糖尿病"],
    insuranceType: "城镇职工医保", idCard: "11010519540315****",
    birthDate: "1954-03-15", status: "normal",
    emergencyContacts: [
      { level: 1, name: "李明", relation: "儿子", phone: "139****1234", avatar: "/images/avatar_male.png" },
      { level: 2, name: "张丽", relation: "女儿", phone: "136****5678", avatar: "/images/avatar_female.png" },
      { level: 3, name: "王阿姨", relation: "邻居", phone: "135****9012", avatar: "/images/avatar_female.png" },
    ],
  },
  {
    id: "E002", name: "李大爷", age: 78, gender: "男",
    avatar: "/images/elder_002.png", phone: "139****2345",
    address: "北京市朝阳区阳光社区 5 号楼 102 室",
    location: { lat: 39.9225, lng: 116.4440 },
    community: "阳光社区", bloodType: "B",
    allergies: ["磺胺类"],
    medicalHistory: ["冠心病", "高血压", "关节炎"],
    insuranceType: "城镇职工医保", idCard: "11010519480320****",
    birthDate: "1948-03-20", status: "warning",
    emergencyContacts: [
      { level: 1, name: "李强", relation: "儿子", phone: "137****3456", avatar: "/images/avatar_male.png" },
    ],
  },
  {
    id: "E003", name: "王奶奶", age: 81, gender: "女",
    avatar: "/images/elder_003.png", phone: "136****7890",
    address: "北京市朝阳区绿叶社区 1 号楼 501 室",
    location: { lat: 39.9200, lng: 116.4500 },
    community: "绿叶社区", bloodType: "O",
    allergies: [],
    medicalHistory: ["骨质疏松", "慢性支气管炎"],
    insuranceType: "城镇居民医保", idCard: "11010519451008****",
    birthDate: "1945-10-08", status: "danger",
    emergencyContacts: [
      { level: 1, name: "赵强", relation: "儿子", phone: "138****9012", avatar: "/images/avatar_male.png" },
      { level: 2, name: "赵芳", relation: "女儿", phone: "135****0123", avatar: "/images/avatar_female.png" },
    ],
  },
];
