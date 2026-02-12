import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getChatSocket = () => {
  if (socket) return socket;

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = localStorage.getItem("token") ?? "";

  socket = io(baseURL, {
    auth: { token },
  });

  return socket;
};

export const disconnectChatSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
