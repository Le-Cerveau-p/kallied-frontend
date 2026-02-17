import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import { MessageDisplay } from "../../components/MessageDisplay";
import {
  MessageCircle,
  Users,
  Send,
  Image,
  Paperclip,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import {
  getChatThreads,
  getThreadMessages,
  markChatThreadRead,
  sendThreadMessage,
} from "../../api/chat";
import { getCurrentUser } from "../../api/users";
import { getChatSocket } from "../../utils/chatSocket";

interface Message {
  id: string;
  senderId: string;
  sender: string;
  role: "client" | "staff" | "admin";
  content: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    url: string;
    size?: string;
  };
}

interface Thread {
  id: string;
  projectId: string;
  projectName: string;
  threadType: "Main" | "Staff";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: string[];
}

export default function StaffMessagesPage() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Main" | "Staff">("All");
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<ReturnType<typeof getChatSocket> | null>(null);
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

        const mappedThreads: Thread[] = threadsData.map((thread: any) => ({
          id: thread.id,
          projectId: thread.projectId,
          projectName: thread.projectName,
          threadType: thread.type === "STAFF_ONLY" ? "Staff" : "Main",
          lastMessage: thread.lastMessage ?? "No messages yet",
          lastMessageTime: thread.lastMessageAt
            ? new Date(thread.lastMessageAt).toLocaleString()
            : "-",
          unreadCount: thread.unreadCount ?? 0,
          participants: (thread.participants ?? []).map((p: any) => p.name),
        }));

        setThreads(mappedThreads);
        setUserId(user?.id ?? null);
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
      const mappedThreads: Thread[] = threadsData.map((thread: any) => ({
        id: thread.id,
        projectId: thread.projectId,
        projectName: thread.projectName,
        threadType: thread.type === "STAFF_ONLY" ? "Staff" : "Main",
        lastMessage: thread.lastMessage ?? "No messages yet",
        lastMessageTime: thread.lastMessageAt
          ? new Date(thread.lastMessageAt).toLocaleString()
          : "-",
        unreadCount: thread.unreadCount ?? 0,
        participants: (thread.participants ?? []).map((p: any) => p.name),
      }));
      setThreads(mappedThreads);
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
        sender: message.sender?.name ?? "Unknown",
        role: (message.sender?.role ?? "STAFF").toLowerCase() as Message["role"],
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
            lastMessageTime: mappedMessage.timestamp,
            unreadCount: shouldIncrement
              ? (thread.unreadCount ?? 0) + 1
              : thread.unreadCount ?? 0,
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
  }, [messages, selectedThread?.id]);

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const matchesSearch =
        searchQuery === "" ||
        thread.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterType === "All" || thread.threadType === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [threads, searchQuery, filterType]);

  const groupedThreads = useMemo(
    () =>
      filteredThreads.reduce(
        (acc, thread) => {
          if (!acc[thread.projectName]) {
            acc[thread.projectName] = [];
          }
          acc[thread.projectName].push(thread);
          return acc;
        },
        {} as Record<string, Thread[]>,
      ),
    [filteredThreads],
  );

  const totalUnreadCount = threads.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );

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
    const mappedMessages: Message[] = data.map((message: any) => ({
      id: message.id,
      senderId: message.sender?.id ?? "",
      sender: message.sender?.name ?? "Unknown",
      role: (message.sender?.role ?? "STAFF").toLowerCase() as Message["role"],
      content: message.content ?? "",
      timestamp: new Date(message.createdAt).toLocaleString(),
      attachment: mapAttachment(message.attachments),
    }));
    setMessages(mappedMessages);
  };

  const handleSelectThread = async (thread: Thread) => {
    setSelectedThread(thread);
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
    if (!newMessage.trim() && !attachment) return;

    try {
      await sendThreadMessage(selectedThread.id, {
        content: newMessage.trim() || undefined,
        file: attachment,
      });
      setNewMessage("");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar currentPage="" />
        <StaffSidebar activeItem="messages" />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl" style={{ color: "#001f54" }}>
              Loading messages...
            </h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="" />
      <StaffSidebar activeItem="messages" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {!selectedThread ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
                    Messages
                  </h1>
                  <p className="text-gray-600">
                    All conversations across your projects
                    {totalUnreadCount > 0 && (
                      <span
                        className="ml-2 text-sm font-medium"
                        style={{ color: "#dc2626" }}
                      >
                        - {totalUnreadCount} unread
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={
                        {
                          borderColor: "#e5e7eb",
                          "--tw-ring-color": "#4169e1",
                        } as React.CSSProperties
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="text-gray-400" size={18} />
                    <button
                      onClick={() => setFilterType("All")}
                      className={`px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                        filterType === "All"
                          ? "text-white"
                          : "border hover:bg-gray-50"
                      }`}
                      style={
                        filterType === "All"
                          ? { backgroundColor: "#4169e1" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType("Main")}
                      className={`px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                        filterType === "Main"
                          ? "text-white"
                          : "border hover:bg-gray-50"
                      }`}
                      style={
                        filterType === "Main"
                          ? { backgroundColor: "#4169e1" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      Main
                    </button>
                    <button
                      onClick={() => setFilterType("Staff")}
                      className={`px-4 py-2.5 text-sm rounded-lg font-medium transition-all ${
                        filterType === "Staff"
                          ? "text-white"
                          : "border hover:bg-gray-50"
                      }`}
                      style={
                        filterType === "Staff"
                          ? { backgroundColor: "#32cd32" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      Staff Only
                    </button>
                  </div>
                </div>
              </div>

              {Object.keys(groupedThreads).length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
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
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "Your messages will appear here"}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedThreads).map(
                    ([projectName, projectThreads]) => (
                      <div key={projectName}>
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "#4169e120" }}
                          >
                            <MessageCircle
                              className="w-4 h-4"
                              style={{ color: "#4169e1" }}
                            />
                          </div>
                          <h2
                            className="text-lg font-semibold"
                            style={{ color: "#001f54" }}
                          >
                            {projectName}
                          </h2>
                          <span className="text-sm text-gray-500">
                            ({projectThreads.length})
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          {projectThreads.map((thread) => (
                            <button
                              key={thread.id}
                              onClick={() => handleSelectThread(thread)}
                              className="w-full text-left p-4 bg-white border-2 rounded-xl hover:bg-gray-50 transition-all"
                              style={{
                                borderColor:
                                  thread.threadType === "Main"
                                    ? "#4169e1"
                                    : "#32cd32",
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{
                                    backgroundColor:
                                      thread.threadType === "Main"
                                        ? "#4169e120"
                                        : "#32cd3220",
                                  }}
                                >
                                  <Users
                                    className="w-5 h-5"
                                    style={{
                                      color:
                                        thread.threadType === "Main"
                                          ? "#4169e1"
                                          : "#32cd32",
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span
                                      className="text-xs px-2 py-0.5 rounded font-medium"
                                      style={{
                                        backgroundColor:
                                          thread.threadType === "Main"
                                            ? "#4169e120"
                                            : "#32cd3220",
                                        color:
                                          thread.threadType === "Main"
                                            ? "#4169e1"
                                            : "#32cd32",
                                      }}
                                    >
                                      {thread.threadType === "Main"
                                        ? "Main Thread"
                                        : "Staff Only"}
                                    </span>
                                    {thread.unreadCount > 0 && (
                                      <span
                                        className="inline-block px-2 py-0.5 rounded-full text-white text-xs font-semibold"
                                        style={{ backgroundColor: "#dc2626" }}
                                      >
                                        {thread.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-900 mb-1 truncate">
                                    {thread.lastMessage}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{thread.lastMessageTime}</span>
                                    <span>-</span>
                                    <span>
                                      {thread.participants.length} participants
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => {
                      setSelectedThread(null);
                      setMessages([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2
                        className="text-2xl font-semibold"
                        style={{ color: "#001f54" }}
                      >
                        {selectedThread.projectName}
                      </h2>
                      <span
                        className="text-xs px-2.5 py-1 rounded font-medium"
                        style={{
                          backgroundColor:
                            selectedThread.threadType === "Main"
                              ? "#4169e120"
                              : "#32cd3220",
                          color:
                            selectedThread.threadType === "Main"
                              ? "#4169e1"
                              : "#32cd32",
                        }}
                      >
                        {selectedThread.threadType === "Main"
                          ? "Main Thread"
                          : "Staff Only"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{selectedThread.participants.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                      style={{
                        backgroundColor:
                          message.role === "client"
                            ? "#4169e1"
                            : message.role === "admin"
                              ? "#ff9800"
                              : "#32cd32",
                      }}
                    >
                      {message.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <MessageDisplay
                          content={message.content}
                          attachment={message.attachment}
                          isOwnMessage={message.senderId === userId}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 border-t" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={handleAttachClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Upload image"
                  >
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleAttachClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
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
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
                    disabled={!newMessage.trim() && !attachment}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#4169e1", color: "white" }}
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


