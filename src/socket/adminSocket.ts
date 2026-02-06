import { io } from "socket.io-client";

export const adminSocket = io(import.meta.env.VITE_WS_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});
