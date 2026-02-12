import { api } from "./index";

export const getStaffUsers = () =>
  api.get("/users/staff").then((res) => res.data);

export const getClientUsers = () =>
  api.get("/users/clients").then((res) => res.data);

export const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};
