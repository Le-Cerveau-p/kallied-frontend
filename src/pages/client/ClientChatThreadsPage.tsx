import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import { MessageDisplay } from "../../components/MessageDisplay";
import {
  MessageCircle,
  Search,
  Users,
  Clock,
  FolderKanban,
  ChevronDown,
  X,
  Send,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";
import {
  getChatThreads,
  getThreadMessages,
  markChatThreadRead,
  sendThreadMessage,
} from "../../api/chat";
import { getCurrentUser } from "../../api/users";
import { getChatSocket } from "../../utils/chatSocket";

interface Participant {
  id: string;
  name: string;
  role: "staff" | "admin" | "client";
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "staff" | "admin" | "client";
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    url: string;
    size?: string;
  };
}

interface ChatThread {
  id: string;
  projectName: string;
  projectStatus: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  participants: Participant[];
}

export default function ClientChatThreadsPage() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const socketRef = useRef<ReturnType<typeof getChatSocket> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const loadThreads = async () => {
      try {
        const [threadsData, user] = await Promise.all([
          getChatThreads(),
          getCurrentUser(),
        ]);
        if (!isMounted) return;

        const mapped: ChatThread[] = threadsData.map((thread: any) => ({
          id: thread.id,
          projectName: thread.projectName,
          projectStatus: thread.projectStatus ?? "",
          lastMessage: thread.lastMessage ?? "No messages yet",
          lastActivity: thread.lastMessageAt
            ? new Date(thread.lastMessageAt).toLocaleString()
            : "-",
          unreadCount: thread.unreadCount ?? 0,
          participants: (thread.participants ?? []).map((p: any) => ({
            id: p.id,
            name: p.name,
            role: p.role.toLowerCase() as Participant["role"],
          })),
        }));

        setThreads(mapped);
        setUserId(user?.id ?? null);
        setUserData(user ? { name: user.name, email: user.email } : null);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadThreads();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshThreads = useCallback(async () => {
    try {
      const threadsData = await getChatThreads();
      const mapped: ChatThread[] = threadsData.map((thread: any) => ({
        id: thread.id,
        projectName: thread.projectName,
        projectStatus: thread.projectStatus ?? "",
        lastMessage: thread.lastMessage ?? "No messages yet",
        lastActivity: thread.lastMessageAt
          ? new Date(thread.lastMessageAt).toLocaleString()
          : "-",
        unreadCount: thread.unreadCount ?? 0,
        participants: (thread.participants ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
          role: p.role.toLowerCase() as Participant["role"],
        })),
      }));
      setThreads(mapped);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const socket = getChatSocket();
    socketRef.current = socket;

    const handleNewMessage = (message: any) => {
      const messageThreadId = message.threadId;
      const senderId = message.sender?.id ?? "";
      const isActiveThread = selectedThread?.id === messageThreadId;
      const mappedMessage: Message = {
        id: message.id,
        senderId,
        senderName: message.sender?.name ?? "Unknown",
        senderRole: (
          message.sender?.role ?? "CLIENT"
        ).toLowerCase() as Message["senderRole"],
        content: message.content ?? "",
        timestamp: new Date(message.createdAt).toLocaleString(),
        attachment: mapAttachment(message.attachments),
      };

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== messageThreadId) return thread;
          const shouldIncrement =
            senderId && senderId !== userId && !isActiveThread;
          return {
            ...thread,
            lastMessage: mappedMessage.content || "Sent an attachment",
            lastActivity: mappedMessage.timestamp,
            unreadCount: shouldIncrement
              ? (thread.unreadCount ?? 0) + 1
              : (thread.unreadCount ?? 0),
          };
        }),
      );

      setMessages((prev) => {
        if (!isActiveThread) {
          return prev;
        }
        return [...prev, mappedMessage];
      });

      if (isActiveThread && senderId && senderId !== userId) {
        markChatThreadRead(messageThreadId).catch(console.error);
      }
    };

    const handleThreadUpdated = () => {
      void refreshThreads();
    };

    const handleThreadRead = (payload: any) => {
      if (payload?.userId && payload.userId === userId) {
        void refreshThreads();
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("thread-updated", handleThreadUpdated);
    socket.on("thread-read", handleThreadRead);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("thread-updated", handleThreadUpdated);
      socket.off("thread-read", handleThreadRead);
    };
  }, [selectedThread, userId, refreshThreads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedThread?.id, modalOpen]);

  const mapAttachment = (attachments: any[] | undefined) => {
    const attachmentItem = attachments?.[0];
    if (!attachmentItem) return undefined;
    const name = attachmentItem.fileUrl?.split("/").pop() ?? "attachment";
    const rawUrl = attachmentItem.fileUrl ?? "";
    const url = rawUrl.startsWith("http") ? rawUrl : `${apiBaseUrl}${rawUrl}`;
    return {
      name,
      type: attachmentItem.mimeType,
      url,
    };
  };

  const loadMessages = async (threadId: string) => {
    const data = await getThreadMessages(threadId);
    const mapped: Message[] = data.map((message: any) => ({
      id: message.id,
      senderId: message.sender?.id ?? "",
      senderName: message.sender?.name ?? "Unknown",
      senderRole: (
        message.sender?.role ?? "CLIENT"
      ).toLowerCase() as Message["senderRole"],
      content: message.content ?? "",
      timestamp: new Date(message.createdAt).toLocaleString(),
      attachment: mapAttachment(message.attachments),
    }));
    setMessages(mapped);
  };

  const handleOpenThread = async (thread: ChatThread) => {
    setSelectedThread(thread);
    setModalOpen(true);
    setThreads((prev) =>
      prev.map((item) =>
        item.id === thread.id ? { ...item, unreadCount: 0 } : item,
      ),
    );
    socketRef.current?.emit("join-thread", thread.id);
    await loadMessages(thread.id);
    await markChatThreadRead(thread.id);
  };

  const handleSendMessage = async () => {
    if (!selectedThread) return;
    if (!messageInput.trim() && !attachment) return;

    try {
      await sendThreadMessage(selectedThread.id, {
        content: messageInput.trim() || undefined,
        file: attachment,
      });
      setMessageInput("");
      setAttachment(null);
      await loadMessages(selectedThread.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAttachment(file);
  };

  const projectNames = useMemo(
    () => [
      "All Projects",
      ...Array.from(new Set(threads.map((t) => t.projectName))),
    ],
    [threads],
  );

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject =
      projectFilter === "All Projects" || thread.projectName === projectFilter;
    return matchesSearch && matchesProject;
  });

  const totalUnread = threads.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar
          currentPage=""
          userName={userData?.name}
          userEmail={userData?.email}
        />
        <ClientSidebar activeItem="dashboard" />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl" style={{ color: "#001f54" }}>
              Loading conversations...
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage=""
        userName={userData?.name}
        userEmail={userData?.email}
      />
      <ClientSidebar activeItem="messages" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl" style={{ color: "#001f54" }}>
                Project Conversations
              </h1>
              {totalUnread > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Unread messages:
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: "#4169e1" }}
                  >
                    {totalUnread}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-600">
              All your project conversations in one place
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search conversations or projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className="relative">
                <FolderKanban
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  {projectNames.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredThreads.length === 0 ? (
              <div className="p-12 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <MessageCircle
                    className="w-8 h-8"
                    style={{ color: "#4169e1" }}
                  />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#001f54" }}
                >
                  No conversations found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => handleOpenThread(thread)}
                    className="w-full text-left p-5 transition-all hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#4169e1" }}
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-gray-400" />
                            <h3 className="font-semibold truncate">
                              {thread.projectName}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm mb-2 line-clamp-1 text-gray-700">
                          {thread.lastMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <div className="flex items-center -space-x-1">
                              {thread.participants
                                .slice(0, 3)
                                .map((participant) => (
                                  <div
                                    key={participant.id}
                                    className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                                    style={{ backgroundColor: "#4169e1" }}
                                    title={participant.name}
                                  >
                                    <span className="text-white text-[10px] font-medium">
                                      {participant.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {thread.lastActivity}
                            </span>
                            {thread.unreadCount > 0 && (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-bold text-white min-w-[20px] text-center"
                                style={{ backgroundColor: "#4169e1" }}
                              >
                                {thread.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {modalOpen && selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#4169e1" }}
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2
                        className="text-2xl font-semibold"
                        style={{ color: "#001f54" }}
                      >
                        {selectedThread.projectName}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {selectedThread.participants.length} participants
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === userId;
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: isOwnMessage
                            ? "#32CD32"
                            : message.senderRole === "admin"
                              ? "#ff9800"
                              : "#4169e1",
                        }}
                      >
                        <span className="text-white text-sm font-medium">
                          {message.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>

                      <div
                        className={`flex-1 max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          {!isOwnMessage && (
                            <span
                              className="text-sm font-semibold"
                              style={{ color: "#001f54" }}
                            >
                              {message.senderName}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {message.timestamp}
                          </span>
                        </div>

                        <div
                          className={`rounded-2xl p-4 ${
                            isOwnMessage ? "rounded-tr-none" : "rounded-tl-none"
                          }`}
                          style={{
                            backgroundColor: isOwnMessage
                              ? "#4169e1"
                              : "#f3f4f6",
                            color: isOwnMessage ? "white" : "#1f2937",
                          }}
                        >
                          <MessageDisplay
                            content={message.content}
                            attachment={message.attachment}
                            isOwnMessage={isOwnMessage}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t" style={{ borderColor: "#e5e7eb" }}>
              <div className="flex gap-3">
                <button
                  onClick={handleAttachClick}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <button
                  onClick={handleAttachClick}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Attach image"
                >
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {attachment && (
                  <div className="text-xs text-gray-600 self-center">
                    Attached: {attachment.name}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && messageInput.trim()) {
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#4169e1" }}
                  disabled={!messageInput.trim() && !attachment}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
