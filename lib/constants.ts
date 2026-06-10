export const COLORS = {
  primary: "#F28C28",
  primaryDark: "#D96B00",
  success: "#52C41A",
  warning: "#FAAD14",
  danger: "#FF4D4F",
  textPrimary: "#333333",
  textSecondary: "#666666",
  textDisabled: "#BBBBBB",
  border: "#F2E8DE",
  background: "#FAF7F2",
  cardBg: "#FFFFFF",
} as const;

export const SOS_GRADIENT = "linear-gradient(135deg, #F28C28, #D96B00)";

export const HEALTH_STATUS_MAP = {
  normal: { color: COLORS.success, label: "正常", icon: "✅" },
  warning: { color: COLORS.warning, label: "注意", icon: "⚠️" },
  danger: { color: COLORS.danger, label: "危险", icon: "🔴" },
} as const;

export const ELDER_TABBAR = [
  { label: "首页", path: "/elder", icon: "Home" },
  { label: "健康", path: "/elder/health", icon: "Heart" },
  { label: "活动", path: "/elder/activities", icon: "Calendar" },
  { label: "我的", path: "/elder/contacts", icon: "User" },
] as const;

export const FAMILY_TABBAR = [
  { label: "首页", path: "/family", icon: "Home" },
  { label: "服务", path: "/family/services/book", icon: "Briefcase" },
  { label: "消息", path: "/family/notifications", icon: "Bell" },
  { label: "我的", path: "/family/profile", icon: "User" },
] as const;
