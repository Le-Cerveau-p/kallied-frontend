import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { MessageDisplay } from "../../components/MessageDisplay";
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Check,
  CheckCheck,
  Users,
  MessageSquare,
  Bell,
  X,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  adminJoinChatThread,
  adminLeaveChatThread,
  getChatThreads,
  getThreadMessages,
  markChatThreadRead,
  sendThreadMessage,
} from "../../api/chat";
import { getCurrentUser } from "../../api/users";
import { getChatSocket } from "../../utils/chatSocket";

interface Message {
  id: string;
  sender: string;
  senderRole: "admin" | "staff" | "client";
  content: string;
  timestamp: string;
  isRead: boolean;
  attachment?: {
    name: string;
    type: string;
    url: string;
    size?: string;
  };
}

interface Chat {
  id: string;
  projectId: string;
  projectName: string;
  type: "main" | "staff";
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  participants: string[];
  adminJoined: boolean;
}

export default function AdminMessagesPage() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const socketRef = useRef<ReturnType<typeof getChatSocket> | null>(null);
  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadThreads = async () => {
      try {
        const user = await getCurrentUser();
        const threads = await getChatThreads();
        if (!isMounted) return;

        const mapped: Chat[] = threads.map((thread: any) => ({
          id: thread.id,
          projectId: thread.projectId,
          projectName: thread.projectName,
          type: thread.type === "STAFF_ONLY" ? "staff" : "main",
          unreadCount: thread.unreadCount ?? 0,
          lastMessage: thread.lastMessage ?? "No messages yet",
          lastMessageTime: thread.lastMessageAt
            ? new Date(thread.lastMessageAt).toLocaleString()
            : "-",
          participants: (thread.participants ?? []).map((p: any) => p.name),
          adminJoined: !!thread.adminJoined,
        }));

        setChats(mapped);
        setUserData(user ?? null);
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
      const threads = await getChatThreads();
      const mapped: Chat[] = threads.map((thread: any) => ({
        id: thread.id,
        projectId: thread.projectId,
        projectName: thread.projectName,
        type: thread.type === "STAFF_ONLY" ? "staff" : "main",
        unreadCount: thread.unreadCount ?? 0,
        lastMessage: thread.lastMessage ?? "No messages yet",
        lastMessageTime: thread.lastMessageAt
          ? new Date(thread.lastMessageAt).toLocaleString()
          : "-",
        participants: (thread.participants ?? []).map((p: any) => p.name),
        adminJoined: !!thread.adminJoined,
      }));
      setChats(mapped);
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
      const isActiveThread = selectedChat?.id === messageThreadId;
      const mappedMessage: Message = {
        id: message.id,
        sender: message.sender?.name ?? "Unknown",
        senderRole:
          (message.sender?.role ?? "STAFF").toLowerCase() as Message["senderRole"],
        content: message.content ?? "",
        timestamp: new Date(message.createdAt).toLocaleString(),
        isRead: true,
        attachment: mapAttachment(message.attachments),
      };

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== messageThreadId) return chat;
          const shouldIncrement =
            senderId && senderId !== userId && !isActiveThread;
          return {
            ...chat,
            lastMessage: mappedMessage.content || "Sent an attachment",
            lastMessageTime: mappedMessage.timestamp,
            unreadCount: shouldIncrement
              ? (chat.unreadCount ?? 0) + 1
              : chat.unreadCount ?? 0,
          };
        }),
      );

      setMessages((prev) => {
        if (!isActiveThread) {
          return prev;
        }
        return [...prev, mappedMessage];
      });

      if (
        isActiveThread &&
        senderId &&
        senderId !== userId &&
        selectedChat?.adminJoined
      ) {
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
  }, [selectedChat, userId, refreshThreads]);

  const filteredChats = useMemo(
    () =>
      chats.filter((chat) =>
        chat.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [chats, searchQuery],
  );

  const chatsByProject = useMemo(
    () =>
      filteredChats.reduce(
        (acc, chat) => {
          if (!acc[chat.projectId]) {
            acc[chat.projectId] = {
              projectName: chat.projectName,
              chats: [],
            };
          }
          acc[chat.projectId].chats.push(chat);
          return acc;
        },
        {} as Record<string, { projectName: string; chats: Chat[] }>,
      ),
    [filteredChats],
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
      sender: message.sender?.name ?? "Unknown",
      senderRole: (message.sender?.role ?? "STAFF").toLowerCase() as Message["senderRole"],
      content: message.content ?? "",
      timestamp: new Date(message.createdAt).toLocaleString(),
      isRead: true,
      attachment: mapAttachment(message.attachments),
    }));
    setMessages(mappedMessages);
  };

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    setChats((prev) =>
      prev.map((item) =>
        item.id === chat.id ? { ...item, unreadCount: 0 } : item,
      ),
    );
    socketRef.current?.emit("join-thread", chat.id);
    await loadMessages(chat.id);
    if (chat.adminJoined) {
      await markChatThreadRead(chat.id);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat) return;
    if (!messageInput.trim() && !attachment) return;

    try {
      await sendThreadMessage(selectedChat.id, {
        content: messageInput.trim() || undefined,
        file: attachment,
      });
      setMessageInput("");
      setAttachment(null);
      await loadMessages(selectedChat.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoinChat = async () => {
    if (!selectedChat) return;
    await adminJoinChatThread(selectedChat.id);
    const updated = chats.map((c) =>
      c.id === selectedChat.id ? { ...c, adminJoined: true } : c,
    );
    setChats(updated);
    setSelectedChat({ ...selectedChat, adminJoined: true });
    setShowJoinDialog(false);
    await loadMessages(selectedChat.id);
    await markChatThreadRead(selectedChat.id);
  };

  const handleLeaveChat = async () => {
    if (!selectedChat) return;
    await adminLeaveChatThread(selectedChat.id);
    const updated = chats.map((c) =>
      c.id === selectedChat.id ? { ...c, adminJoined: false } : c,
    );
    setChats(updated);
    setSelectedChat({ ...selectedChat, adminJoined: false });
    setShowLeaveDialog(false);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAttachment(file);
  };

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar
          currentPage=""
          userName={userData?.name}
          userEmail={userData?.email}
          userAvatar=""
          notificationCount={3}
        />
        <AdminSidebar activeItem="messages" />
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
      <AuthNavbar
        currentPage=""
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <AdminSidebar activeItem="messages" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl" style={{ color: "#001f54" }}>
                  Messages
                </h1>
                <p className="text-gray-600 mt-2">
                  View and participate in project communications
                </p>
              </div>
              {totalUnread > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                  <Bell className="w-5 h-5" style={{ color: "#d4183d" }} />
                  <span className="font-medium" style={{ color: "#d4183d" }}>
                    {totalUnread} unread message{totalUnread !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden h-[calc(100vh-16rem)]">
            <div className="flex h-full">
              <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {Object.values(chatsByProject).map((project) => (
                    <div
                      key={project.projectName}
                      className="border-b border-gray-100"
                    >
                      <div className="px-4 py-3 bg-gray-50">
                        <h3
                          className="font-medium text-sm"
                          style={{ color: "#001f54" }}
                        >
                          {project.projectName}
                        </h3>
                      </div>
                      {project.chats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => handleSelectChat(chat)}
                          className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                            selectedChat?.id === chat.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {chat.type === "main" ? (
                                <MessageSquare
                                  className="w-4 h-4"
                                  style={{ color: "#4169e1" }}
                                />
                              ) : (
                                <Users
                                  className="w-4 h-4"
                                  style={{ color: "#9c27b0" }}
                                />
                              )}
                              <span
                                className="font-medium text-sm"
                                style={{ color: "#001f54" }}
                              >
                                {chat.type === "main"
                                  ? "Main Chat"
                                  : "Staff-Only Chat"}
                              </span>
                              {chat.adminJoined && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full bg-blue-100"
                                  style={{ color: "#4169e1" }}
                                >
                                  Joined
                                </span>
                              )}
                            </div>
                            {chat.unreadCount > 0 && (
                              <span
                                className="text-xs font-medium px-2 py-1 rounded-full text-white"
                                style={{ backgroundColor: "#d4183d" }}
                              >
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {chat.lastMessageTime}
                            </span>
                            <div className="flex items-center gap-1">
                              {chat.participants
                                .slice(0, 3)
                                .map((participant, idx) => (
                                  <div
                                    key={idx}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                                    style={{ backgroundColor: "#4169e1" }}
                                    title={participant}
                                  >
                                    {participant
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </div>
                                ))}
                              {chat.participants.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{chat.participants.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {selectedChat ? (
                <div className="flex-1 flex flex-col">
                  <div
                    className="p-4 border-b border-gray-200"
                    style={{ backgroundColor: "#001f54" }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-medium text-white">
                            {selectedChat.projectName}
                          </h2>
                          <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 text-white">
                            {selectedChat.type === "main"
                              ? "Main Chat"
                              : "Staff-Only"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">
                          {selectedChat.participants.length > 0
                            ? `${selectedChat.participants.length} participant${
                                selectedChat.participants.length !== 1
                                  ? "s"
                                  : ""
                              }`
                            : "No participants"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedChat.adminJoined ? (
                          <button
                            onClick={() => setShowLeaveDialog(true)}
                            className="px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors text-white flex items-center gap-2 text-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            Leave Chat
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowJoinDialog(true)}
                            className="px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
                            style={{
                              backgroundColor: "#a7fc00",
                              color: "#001f54",
                            }}
                          >
                            <UserPlus className="w-4 h-4" />
                            Join Chat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!selectedChat.adminJoined && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                        <Bell
                          className="w-5 h-5 mt-0.5"
                          style={{ color: "#ff9800" }}
                        />
                        <div>
                          <p
                            className="font-medium text-sm"
                            style={{ color: "#001f54" }}
                          >
                            You are not in this chat
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Join the chat to view messages and participate in
                            the conversation.
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedChat.adminJoined &&
                      messages.map((message) => {
                        const isCurrentUser = message.senderRole === "admin";
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-md ${isCurrentUser ? "text-right" : "text-left"}`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {!isCurrentUser && (
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#001f54" }}
                                  >
                                    {message.sender}
                                  </span>
                                )}
                                {isCurrentUser && (
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#001f54" }}
                                  >
                                    You
                                  </span>
                                )}
                                <span className="text-xs text-gray-500">
                                  {message.timestamp}
                                </span>
                              </div>
                              <div
                                className={`inline-block p-3 rounded-lg ${
                                  isCurrentUser
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                }`}
                              >
                                <MessageDisplay
                                  content={message.content}
                                  attachment={message.attachment}
                                  isOwnMessage={isCurrentUser}
                                />
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                {isCurrentUser && (
                                  <>
                                    {message.isRead ? (
                                      <CheckCheck
                                        className="w-4 h-4"
                                        style={{ color: "#4169e1" }}
                                      />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {selectedChat.adminJoined && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-end gap-2">
                        <button
                          onClick={handleAttachClick}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "#717182" }}
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleAttachClick}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "#717182" }}
                        >
                          <ImageIcon className="w-5 h-5" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        {attachment && (
                          <div className="text-xs text-gray-600">
                            Attached: {attachment.name}
                          </div>
                        )}
                        <div className="flex-1">
                          <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Type your message..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            rows={2}
                          />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() && !attachment}
                          className="p-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: "#4169e1" }}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl mb-2" style={{ color: "#001f54" }}>
                      Select a chat
                    </h3>
                    <p className="text-gray-500">
                      Choose a project chat from the list to view and
                      participate in conversations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showJoinDialog && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e3f2fd" }}
              >
                <UserPlus className="w-6 h-6" style={{ color: "#4169e1" }} />
              </div>
              <h2
                className="text-2xl text-center mb-2"
                style={{ color: "#001f54" }}
              >
                Join Chat
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to join the{" "}
                <span className="font-medium" style={{ color: "#001f54" }}>
                  {selectedChat.type === "main"
                    ? "Main Chat"
                    : "Staff-Only Chat"}
                </span>{" "}
                for {selectedChat.projectName}?
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                All participants will be notified when you join.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinDialog(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#4169e1", color: "#ffffff" }}
                onClick={handleJoinChat}
              >
                Join Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {showLeaveDialog && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#fce4ec" }}
              >
                <LogOut className="w-6 h-6" style={{ color: "#d4183d" }} />
              </div>
              <h2
                className="text-2xl text-center mb-2"
                style={{ color: "#001f54" }}
              >
                Leave Chat
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to leave the{" "}
                <span className="font-medium" style={{ color: "#001f54" }}>
                  {selectedChat.type === "main"
                    ? "Main Chat"
                    : "Staff-Only Chat"}
                </span>{" "}
                for {selectedChat.projectName}?
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                All participants will be notified when you leave.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveDialog(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#d4183d" }}
                onClick={handleLeaveChat}
              >
                Leave Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
