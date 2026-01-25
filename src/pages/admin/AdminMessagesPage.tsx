import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  Check,
  CheckCheck,
  Users,
  MessageSquare,
  Bell,
  X,
  UserPlus,
  LogOut,
} from "lucide-react";

interface Message {
  id: number;
  sender: string;
  senderRole: "admin" | "staff" | "client";
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
}

interface Attachment {
  id: number;
  name: string;
  type: "image" | "file";
  url: string;
  size: string;
}

interface Chat {
  id: number;
  projectId: number;
  projectName: string;
  type: "main" | "staff";
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  participants: string[];
  adminJoined: boolean;
}

export default function AdminMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // Mock chat data
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      projectId: 1,
      projectName: "E-Commerce Platform Redesign",
      type: "main",
      unreadCount: 3,
      lastMessage: "The homepage mockups are ready for review",
      lastMessageTime: "10:30 AM",
      participants: ["Sarah Johnson", "Mike Chen", "Client - TechCorp"],
      adminJoined: false,
    },
    {
      id: 2,
      projectId: 1,
      projectName: "E-Commerce Platform Redesign",
      type: "staff",
      unreadCount: 0,
      lastMessage: "We need to discuss the API integration approach",
      lastMessageTime: "9:45 AM",
      participants: ["Sarah Johnson", "Mike Chen"],
      adminJoined: true,
    },
    {
      id: 3,
      projectId: 2,
      projectName: "Mobile App Development",
      type: "main",
      unreadCount: 5,
      lastMessage: "Can we schedule a call to discuss the requirements?",
      lastMessageTime: "Yesterday",
      participants: ["Client - StartupXYZ"],
      adminJoined: false,
    },
    {
      id: 4,
      projectId: 2,
      projectName: "Mobile App Development",
      type: "staff",
      unreadCount: 1,
      lastMessage: "Project is pending approval",
      lastMessageTime: "Yesterday",
      participants: [],
      adminJoined: true,
    },
    {
      id: 5,
      projectId: 3,
      projectName: "Cloud Migration Project",
      type: "main",
      unreadCount: 0,
      lastMessage: "Thanks for the update!",
      lastMessageTime: "Jan 20",
      participants: ["Emily Rodriguez", "Client - Enterprise Co."],
      adminJoined: true,
    },
    {
      id: 6,
      projectId: 3,
      projectName: "Cloud Migration Project",
      type: "staff",
      unreadCount: 2,
      lastMessage: "Security review completed",
      lastMessageTime: "Jan 21",
      participants: ["Emily Rodriguez", "David Kim"],
      adminJoined: true,
    },
  ]);

  // Mock messages for selected chat
  const [messages] = useState<Message[]>([
    {
      id: 1,
      sender: "Sarah Johnson",
      senderRole: "staff",
      content:
        "Good morning! I wanted to share the latest progress on the homepage redesign.",
      timestamp: "9:00 AM",
      isRead: true,
    },
    {
      id: 2,
      sender: "Mike Chen",
      senderRole: "staff",
      content:
        "The backend API for the product catalog is almost ready. Should be done by EOD.",
      timestamp: "9:15 AM",
      isRead: true,
    },
    {
      id: 3,
      sender: "Client - TechCorp",
      senderRole: "client",
      content: "That sounds great! Can I see a preview of the homepage?",
      timestamp: "9:30 AM",
      isRead: true,
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      senderRole: "staff",
      content: "Absolutely! Here are the mockups.",
      timestamp: "10:00 AM",
      isRead: true,
      attachments: [
        {
          id: 1,
          name: "homepage-mockup-v2.png",
          type: "image",
          url: "#",
          size: "2.4 MB",
        },
      ],
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      senderRole: "staff",
      content: "The homepage mockups are ready for review",
      timestamp: "10:30 AM",
      isRead: false,
    },
  ]);

  const filteredChats = chats.filter((chat) =>
    chat.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group chats by project
  const chatsByProject = filteredChats.reduce(
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
    {} as Record<number, { projectName: string; chats: Chat[] }>,
  );

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      // In a real app, this would send the message to the backend
      setMessageInput("");
    }
  };

  const handleJoinChat = () => {
    if (selectedChat) {
      setChats(
        chats.map((c) =>
          c.id === selectedChat.id ? { ...c, adminJoined: true } : c,
        ),
      );
      setSelectedChat({ ...selectedChat, adminJoined: true });
      setShowJoinDialog(false);
    }
  };

  const handleLeaveChat = () => {
    if (selectedChat) {
      setChats(
        chats.map((c) =>
          c.id === selectedChat.id ? { ...c, adminJoined: false } : c,
        ),
      );
      setSelectedChat({ ...selectedChat, adminJoined: false });
      setShowLeaveDialog(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return { bg: "#fce4ec", text: "#d4183d" };
      case "staff":
        return { bg: "#e3f2fd", text: "#4169e1" };
      case "client":
        return { bg: "#f1f8e9", text: "#558b2f" };
      default:
        return { bg: "#f5f5f5", text: "#717182" };
    }
  };

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="messages" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
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

          {/* Messages Layout */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-[calc(100vh-16rem)]">
            <div className="flex h-full">
              {/* Left Sidebar - Chat List */}
              <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col">
                {/* Search */}
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

                {/* Chat List */}
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
                          onClick={() => setSelectedChat(chat)}
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

              {/* Right Side - Chat View */}
              {selectedChat ? (
                <div className="flex-1 flex flex-col">
                  {/* Chat Header */}
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

                  {/* Messages */}
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
                        const roleColor = getRoleBadgeColor(message.senderRole);

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
                                  <>
                                    <div
                                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                                      style={{
                                        backgroundColor: roleColor.text,
                                      }}
                                    >
                                      {message.sender
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: "#001f54" }}
                                    >
                                      {message.sender}
                                    </span>
                                    <span
                                      className="text-xs px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: roleColor.bg,
                                        color: roleColor.text,
                                      }}
                                    >
                                      {message.senderRole}
                                    </span>
                                  </>
                                )}
                                {isCurrentUser && (
                                  <>
                                    <span
                                      className="text-xs px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: roleColor.bg,
                                        color: roleColor.text,
                                      }}
                                    >
                                      Admin
                                    </span>
                                    <span
                                      className="text-sm font-medium"
                                      style={{ color: "#001f54" }}
                                    >
                                      You
                                    </span>
                                  </>
                                )}
                              </div>
                              <div
                                className={`inline-block p-3 rounded-lg ${
                                  isCurrentUser
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                {message.attachments &&
                                  message.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                      {message.attachments.map((attachment) => (
                                        <div
                                          key={attachment.id}
                                          className={`p-2 rounded-lg flex items-center gap-2 ${
                                            isCurrentUser
                                              ? "bg-blue-600 bg-opacity-50"
                                              : "bg-white border border-gray-200"
                                          }`}
                                        >
                                          {attachment.type === "image" ? (
                                            <ImageIcon className="w-4 h-4" />
                                          ) : (
                                            <FileText className="w-4 h-4" />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs truncate">
                                              {attachment.name}
                                            </p>
                                            <p className="text-xs opacity-70">
                                              {attachment.size}
                                            </p>
                                          </div>
                                          <button className="p-1 hover:bg-black hover:bg-opacity-10 rounded">
                                            <Download className="w-4 h-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                <span>{message.timestamp}</span>
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

                    {selectedChat.adminJoined &&
                      selectedChat.type === "main" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                          <UserPlus
                            className="w-4 h-4 mt-0.5"
                            style={{ color: "#4169e1" }}
                          />
                          <p className="text-xs text-gray-600">
                            <span
                              className="font-medium"
                              style={{ color: "#001f54" }}
                            >
                              Admin
                            </span>{" "}
                            joined the chat
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Message Input */}
                  {selectedChat.adminJoined && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-end gap-2">
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "#717182" }}
                        >
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          style={{ color: "#717182" }}
                        >
                          <ImageIcon className="w-5 h-5" />
                        </button>
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
                          disabled={!messageInput.trim()}
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

      {/* Join Chat Dialog */}
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

      {/* Leave Chat Dialog */}
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
