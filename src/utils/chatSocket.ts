import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketToken = "";
let diagnosticsBound = false;

export const getChatSocket = () => {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const token = localStorage.getItem("token") ?? "";

  if (socket && socketToken !== token) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socketToken = token;
    socket = io(baseURL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
  } else if (socket.disconnected) {
    socket.auth = { token };
    socket.connect();
  }

  if (socket && !diagnosticsBound && import.meta.env.DEV) {
    diagnosticsBound = true;
    socket.on("connect", () => {
      console.info("[chat-socket] connected", { id: socket?.id });
    });
    socket.on("disconnect", (reason) => {
      console.info("[chat-socket] disconnected", { reason });
    });
    socket.on("connect_error", (error) => {
      console.error("[chat-socket] connect_error", error?.message ?? error);
    });
  }

  return socket;
};

export const disconnectChatSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
  socketToken = "";
  diagnosticsBound = false;
};
