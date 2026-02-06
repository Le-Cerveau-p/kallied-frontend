import { api } from "./index"; // your axios instance

export const getAdminDashboard = () =>
  api.get("/admin/dashboard").then((res) => res.data);

export const getPendingProjects = () =>
  api.get("/admin/pending-projects").then((res) => res.data);

export const getPendingProcurements = () =>
  api.get("/admin/pending-procurements").then((res) => res.data);

export const getAdminCharts = () =>
  api.get("/admin/charts").then((res) => res.data);

export const getUsers = () => api.get("/admin/users").then((res) => res.data);

export const getCompanyUsers = () =>
  api.get("/admin/company-users").then((res) => res.data);

export const getUserProjects = (userId: string) =>
  api.get(`/admin/users/${userId}/projects`).then((res) => res.data);

export const assignStaffToProject = (projectId: string, staffId: string) =>
  api.post(`/admin/projects/${projectId}/assign-staff/${staffId}`);

export const removeStaffFromProject = (projectId: string, staffId: string) =>
  api.delete(`/admin/projects/${projectId}/remove-staff/${staffId}`);

export const getAdminProjects = () =>
  api.get("/admin/projects-management").then((res) => res.data);

export const getAdminProcurements = () =>
  api.get("/admin/procurements").then((res) => res.data);

export const approveProcurement = (id: string) =>
  api.post(`/admin/procurements/${id}/approve`);

export const rejectProcurement = (id: string, reason: string) =>
  api.post(`/admin/procurements/${id}/reject`, { reason });

export const getActivityLogs = async (params?: {
  page?: number;
  limit?: number;
  entity?: string;
  actorId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const res = await api.get("/admin/activity-logs", { params });
  return res.data;
};
