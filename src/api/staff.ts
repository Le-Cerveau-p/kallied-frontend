import { api } from "./index"; // your axios instance

export const getStaffDashboard = () =>
  api.get("/staff/dashboard").then((res) => res.data);

export const getStaffProjectById = (id: string) =>
  api.get(`/staff/projects/${id}`).then((res) => res.data);

export const getMyStaffProjects = () =>
  api.get("/staff/projects").then((res) => res.data);

export const getStaffInvoices = () =>
  api.get("/staff/invoices").then((res) => res.data);

export const createStaffInvoice = (payload: {
  projectId: string;
  dueDate: string;
  lineItems: Array<{ description: string; quantity: number; rate: number }>;
  tax?: number;
  notes?: string;
}) => api.post("/staff/invoices", payload).then((res) => res.data);

export const createStaffProject = (payload: {
  name: string;
  description?: string;
  clientId: string;
  category: string;
  eCD: string;
  budget?: number;
}) => api.post("/projects", payload).then((res) => res.data);

export const getStaffTimesheets = () =>
  api.get("/staff/timesheets").then((res) => res.data);

export const createStaffTimesheet = (payload: {
  projectId: string;
  date: string;
  hours: number;
  notes?: string;
}) => api.post("/staff/timesheets", payload).then((res) => res.data);

export const deleteStaffTimesheet = (id: string) =>
  api.delete(`/staff/timesheets/${id}`).then((res) => res.data);

export const uploadProjectDocument = (
  projectId: string,
  payload: {
    file: File;
    name: string;
    category: string;
    groupName: string;
  },
) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("groupName", payload.groupName);

  return api
    .post(`/projects/${projectId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};
