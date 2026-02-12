import { api } from "./index";

export const getClientDashboard = () =>
  api.get("/client/dashboard").then((res) => res.data);

export const getClientProjects = () =>
  api.get("/client/projects").then((res) => res.data);

export const getClientReports = () =>
  api.get("/client/reports").then((res) => res.data);

export const getClientInvoices = () =>
  api.get("/client/invoices").then((res) => res.data);

export const markClientInvoicePaid = (id: string) =>
  api.post(`/client/invoices/${id}/mark-paid`).then((res) => res.data);

export const getClientTimesheets = (params?: {
  projectId?: string;
  status?: string;
  staffId?: string;
}) => api.get("/client/timesheets", { params }).then((res) => res.data);
