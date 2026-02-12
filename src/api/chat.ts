import { api } from "./index";

export const getChatThreads = () =>
  api.get("/chat/threads").then((res) => res.data);

export const getProjectThreads = (projectId: string) =>
  api.get(`/chat/threads/${projectId}`).then((res) => res.data);

export const getThreadMessages = (threadId: string) =>
  api.get(`/chat/threads/${threadId}/messages`).then((res) => res.data);

export const sendThreadMessage = (
  threadId: string,
  payload: { content?: string; file?: File | null },
) => {
  const formData = new FormData();
  if (payload.content) {
    formData.append("content", payload.content);
  }
  if (payload.file) {
    formData.append("files", payload.file);
  }
  return api
    .post(`/chat/threads/${threadId}/message`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

export const markChatMessageRead = (messageId: string) =>
  api.post(`/chat/messages/${messageId}/read`).then((res) => res.data);

export const markChatThreadRead = (threadId: string) =>
  api.post(`/chat/threads/${threadId}/read`).then((res) => res.data);

export const getChatThreadUnreadCount = (threadId: string) =>
  api.get(`/chat/threads/${threadId}/unread-count`).then((res) => res.data);

export const adminJoinChatThread = (threadId: string) =>
  api.post(`/chat/threads/adminjoin/${threadId}`).then((res) => res.data);

export const adminLeaveChatThread = (threadId: string) =>
  api.post(`/chat/threads/adminleave/${threadId}`).then((res) => res.data);
