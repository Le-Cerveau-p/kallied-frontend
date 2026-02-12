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

export const requestAdminOtp = (purpose?: string, recipientEmail?: string) =>
  api
    .post("/admin/otp/send", { purpose, recipientEmail })
    .then((res) => res.data);

export const verifyAdminOtp = (otp: string, purpose?: string) =>
  api.post("/admin/otp/verify", { otp, purpose }).then((res) => res.data);

export const createAdminUser = (payload: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF" | "CLIENT";
  companyName?: string;
  department?: string;
  address?: string;
  phone?: string;
}) => api.post("/admin/users", payload).then((res) => res.data);

export const updateAdminUser = (
  userId: string,
  payload: { name: string; email: string },
) => api.patch(`/admin/users/${userId}`, payload).then((res) => res.data);

export const updateAdminUserRole = (
  userId: string,
  role: "ADMIN" | "STAFF" | "CLIENT",
) =>
  api
    .patch(`/admin/users/${userId}/role`, { role })
    .then((res) => res.data);

export const updateAdminUserStatus = (
  userId: string,
  status: "ENABLED" | "DISABLED",
) =>
  api
    .patch(`/admin/users/${userId}/status`, { status })
    .then((res) => res.data);

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
  api.patch(`/admin/procurements/${id}/approve`);

export const rejectProcurement = (id: string, reason: string) =>
  api.patch(`/admin/procurements/${id}/reject`, { reason });

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

export const getAdminInvoices = () =>
  api.get("/admin/invoices").then((res) => res.data);

export const createAdminInvoice = (payload: {
  projectId: string;
  dueDate: string;
  lineItems: Array<{ description: string; quantity: number; rate: number }>;
  tax?: number;
  notes?: string;
}) => api.post("/admin/invoices", payload).then((res) => res.data);

export const approveInvoice = (id: string) =>
  api.patch(`/admin/invoices/${id}/approve`).then((res) => res.data);

export const rejectInvoice = (id: string, reason: string) =>
  api
    .patch(`/admin/invoices/${id}/reject`, { reason })
    .then((res) => res.data);

export const confirmInvoicePayment = (id: string) =>
  api.patch(`/admin/invoices/${id}/confirm-payment`).then((res) => res.data);

export const getAdminTimesheets = (params?: {
  staffId?: string;
  projectId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}) => api.get("/admin/timesheets", { params }).then((res) => res.data);

export const approveTimesheet = (id: string) =>
  api.patch(`/admin/timesheets/${id}/approve`).then((res) => res.data);

export const rejectTimesheet = (id: string, reason: string) =>
  api
    .patch(`/admin/timesheets/${id}/reject`, { reason })
    .then((res) => res.data);
