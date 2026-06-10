export type ServiceType = "cleaning" | "escort" | "haircut";
export type OrderStatus = "pending" | "accepted" | "inProgress" | "completed" | "cancelled";

export interface ServiceReview {
  stars: number;
  tags: string[];
  comment: string;
  images: string[];
  createdAt: string;
}

export interface ServiceOrder {
  id: string;
  familyId: string;
  elderId: string;
  elderName: string;
  serviceType: ServiceType;
  status: OrderStatus;
  scheduledTime: string;
  address: string;
  notes: string;
  price: number;
  provider: { id: string; name: string; phone: string; rating: number; avatar: string };
  timeline: Array<{ status: string; label: string; time: string }>;
  review?: ServiceReview;
}
