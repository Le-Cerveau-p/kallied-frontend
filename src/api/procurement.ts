import { api } from "./index";

export const createProcurement = (payload: {
  projectId: string;
  title: string;
  description?: string;
}) => api.post("/procurement", payload).then((res) => res.data);

export const updateProcurement = (
  id: string,
  payload: { title?: string; description?: string; cost?: number },
) => api.patch(`/procurement/${id}`, payload).then((res) => res.data);

export const submitProcurement = (id: string) =>
  api.patch(`/procurement/${id}/submit`).then((res) => res.data);

export const addProcurementItem = (
  requestId: string,
  payload: {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost?: number;
    type: "MATERIAL" | "SERVICE";
  },
) => api.post(`/procurement/${requestId}/items`, payload).then((res) => res.data);

export const updateProcurementItem = (
  itemId: string,
  payload: {
    name?: string;
    quantity?: number;
    unit?: string;
    estimatedCost?: number;
    type?: "MATERIAL" | "SERVICE";
  },
) => api.patch(`/procurement/items/${itemId}`, payload).then((res) => res.data);

export const deleteProcurementItem = (itemId: string) =>
  api.delete(`/procurement/items/${itemId}`).then((res) => res.data);
