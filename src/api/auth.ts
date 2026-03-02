import { api } from "./index";

export const requestPasswordResetOtp = (email: string) =>
  api.post("/auth/password/otp", { email }).then((res) => res.data);

export const resetPassword = (payload: {
  email: string;
  otp: string;
  newPassword: string;
}) => api.post("/auth/password/reset", payload).then((res) => res.data);
