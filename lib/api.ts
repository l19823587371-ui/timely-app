import { USE_MOCK } from "./mock";
import * as mockApi from "./mock-api";

type ApiModule = typeof mockApi;

// In production, replace with real fetch calls
const realApi = {} as ApiModule;

const api: ApiModule = USE_MOCK ? mockApi : realApi;

export const {
  getElderProfile, getElderContacts, getElderLocation,
  triggerSOS, getSOSAlert, getSOSProgress, getSOSQueue,
  acceptSOS, updateSOSProgress, cancelSOS, submitSOSRating,
  getSOSHistory, getSOSVideo,
  getLatestHealth, getHealthTrend, getWeeklyReport,
  getActivities, registerActivity,
  getServiceOrders, getServiceOrder, createServiceOrder, submitServiceReview,
  getNotifications, markNotificationRead, getUnreadCount,
  getAnnouncements,
  getMonitoringAlerts, acknowledgeMonitoring,
  getMedicalDashboard, searchElders, getElderRecords, getElderVitals,
  getFamilyDashboard, getFamilyBindings, getFamilyProfile,
} = api;
