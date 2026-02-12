import { api } from "./index";

export const getCompanyProfile = () =>
  api.get("/company/profile").then((res) => res.data);
