import { api } from "./index";

export const getUnreadNotificationCount = async (): Promise<number> => {
  const res = await api.get("/notifications/unread-count");
  return Number(res.data?.count ?? 0);
};

export const getNotifications = async (limit = 20) =>
  api.get("/notifications", { params: { limit } }).then((res) => res.data);

export const markNotificationRead = async (id: string) =>
  api.patch(`/notifications/${id}/read`).then((res) => res.data);

export const markAllNotificationsRead = async () =>
  api.patch("/notifications/read-all").then((res) => res.data);

