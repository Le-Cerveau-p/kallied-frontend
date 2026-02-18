import { api } from "./index";

export const getCompanyProfile = () =>
  api.get("/company/profile").then((res) => res.data);

export const sendContactMessage = (payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => api.post("/company/contact", payload).then((res) => res.data);
