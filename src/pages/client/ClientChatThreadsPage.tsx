import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import {
  ChevronRight,
  MessageCircle,
  Search,
  Users,
  UserCircle,
  Shield,
  HeadsetIcon,
  Clock,
  FolderKanban,
  ChevronDown,
} from "lucide-react";

interface Participant {
  id: number;
  name: string;
  role: "staff" | "admin" | "support";
  avatar?: string;
}

interface ChatThread {
  id: number;
  projectName: string;
  projectStatus: "Pending" | "In Progress" | "Completed";
  threadName: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  participants: Participant[];
  isUnread: boolean;
}

export default function ClientChatThreadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [selectedThread, setSelectedThread] = useState<number | null>(null);

  // Mock chat threads data - one thread per project
  const allThreads: ChatThread[] = [
    {
      id: 1,
      projectName: "Website Redesign",
      projectStatus: "In Progress",
      threadName: "Project Chat",
      lastMessage:
        "Sarah: Great! I've updated the homepage mockup based on your feedback. Please take a look when you have a moment.",
      lastActivity: "10 minutes ago",
      unreadCount: 3,
      participants: [
        { id: 1, name: "Sarah Chen", role: "staff" },
        { id: 2, name: "James Wilson", role: "staff" },
        { id: 3, name: "Emily Thompson", role: "admin" },
      ],
      isUnread: true,
    },
    {
      id: 2,
      projectName: "Mobile App Development",
      projectStatus: "In Progress",
      threadName: "Project Chat",
      lastMessage:
        "James: Backend API integration is complete. Authentication module has been tested and approved.",
      lastActivity: "2 hours ago",
      unreadCount: 1,
      participants: [
        { id: 2, name: "James Wilson", role: "staff" },
        { id: 4, name: "David Kim", role: "staff" },
        { id: 3, name: "Emily Thompson", role: "admin" },
      ],
      isUnread: true,
    },
    {
      id: 3,
      projectName: "Brand Identity Package",
      projectStatus: "Pending",
      threadName: "Project Chat",
      lastMessage:
        "Maria: Awaiting your feedback on the three logo concepts we presented. Please review by end of week.",
      lastActivity: "1 day ago",
      unreadCount: 2,
      participants: [
        { id: 5, name: "Maria Rodriguez", role: "staff" },
        { id: 3, name: "Emily Thompson", role: "admin" },
      ],
      isUnread: true,
    },
    {
      id: 4,
      projectName: "E-commerce Platform",
      projectStatus: "In Progress",
      threadName: "Project Chat",
      lastMessage:
        "David: Security audit is in progress. Payment gateway integration tested successfully. On track for launch.",
      lastActivity: "3 hours ago",
      unreadCount: 0,
      participants: [
        { id: 4, name: "David Kim", role: "staff" },
        { id: 6, name: "Michael Roberts", role: "admin" },
      ],
      isUnread: false,
    },
    {
      id: 5,
      projectName: "Marketing Campaign",
      projectStatus: "Completed",
      threadName: "Project Chat",
      lastMessage:
        "Emily: Campaign concluded successfully. Final analytics report uploaded. Overall engagement exceeded targets by 23%.",
      lastActivity: "2 days ago",
      unreadCount: 0,
      participants: [
        { id: 3, name: "Emily Thompson", role: "admin" },
        { id: 7, name: "Alex Martinez", role: "staff" },
      ],
      isUnread: false,
    },
    {
      id: 6,
      projectName: "CRM System Integration",
      projectStatus: "In Progress",
      threadName: "Project Chat",
      lastMessage:
        "Alex: Data migration planning completed. Moving into system configuration phase. Training materials being prepared.",
      lastActivity: "6 hours ago",
      unreadCount: 0,
      participants: [
        { id: 7, name: "Alex Martinez", role: "staff" },
        { id: 8, name: "Rachel Green", role: "staff" },
      ],
      isUnread: false,
    },
    {
      id: 7,
      projectName: "Content Management System",
      projectStatus: "In Progress",
      threadName: "Project Chat",
      lastMessage:
        "You: Thanks for the demo yesterday. The workflow looks much cleaner now.",
      lastActivity: "1 day ago",
      unreadCount: 0,
      participants: [
        { id: 1, name: "Sarah Chen", role: "staff" },
        { id: 4, name: "David Kim", role: "staff" },
      ],
      isUnread: false,
    },
    {
      id: 8,
      projectName: "API Documentation Portal",
      projectStatus: "In Progress",
      threadName: "Project Chat",
      lastMessage:
        "Rachel: First draft of API documentation is ready for your review. Check the shared folder.",
      lastActivity: "4 days ago",
      unreadCount: 1,
      participants: [{ id: 8, name: "Rachel Green", role: "staff" }],
      isUnread: true,
    },
  ];

  // Get unique project names for filter
  const projectNames = [
    "All Projects",
    ...Array.from(new Set(allThreads.map((t) => t.projectName))),
  ];

  // Filter threads based on search and project
  const filteredThreads = allThreads.filter((thread) => {
    const matchesSearch =
      thread.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject =
      projectFilter === "All Projects" || thread.projectName === projectFilter;
    return matchesSearch && matchesProject;
  });

  // Count total unread messages
  const totalUnread = allThreads.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );

  const getProjectStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return { backgroundColor: "#4caf5020", color: "#4caf50" };
      case "In Progress":
        return { backgroundColor: "#4169e120", color: "#4169e1" };
      case "Pending":
        return { backgroundColor: "#ff980020", color: "#ff9800" };
      default:
        return { backgroundColor: "#71718220", color: "#717182" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="client" />
      <ClientSidebar activeItem="messages" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
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

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
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

              {/* Project Filter Dropdown */}
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

          {/* Thread List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredThreads.length === 0 ? (
              // Empty State
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
              // Thread List
              <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className={`w-full text-left p-5 transition-all hover:bg-gray-50 ${
                      thread.isUnread ? "bg-blue-50/30" : ""
                    } ${selectedThread === thread.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Thread Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          thread.isUnread ? "ring-2 ring-blue-400" : ""
                        }`}
                        style={{
                          backgroundColor: thread.isUnread
                            ? "#4169e1"
                            : "#f3f4f6",
                        }}
                      >
                        <MessageCircle
                          className="w-6 h-6"
                          style={{
                            color: thread.isUnread ? "white" : "#6b7280",
                          }}
                        />
                      </div>

                      {/* Thread Content */}
                      <div className="flex-1 min-w-0">
                        {/* Project Name & Status Badge */}
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-gray-400" />
                            <h3
                              className={`font-semibold truncate ${
                                thread.isUnread
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {thread.projectName}
                            </h3>
                          </div>
                          <span
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                            style={getProjectStatusStyle(thread.projectStatus)}
                          >
                            {thread.projectStatus}
                          </span>
                        </div>

                        {/* Last Message Preview */}
                        <p
                          className={`text-sm mb-2 line-clamp-1 ${
                            thread.isUnread
                              ? "text-gray-700 font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {thread.lastMessage}
                        </p>

                        {/* Footer: Participants & Timestamp */}
                        <div className="flex items-center justify-between">
                          {/* Participants */}
                          <div className="flex items-center gap-2">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <div className="flex items-center -space-x-1">
                              {thread.participants
                                .slice(0, 3)
                                .map((participant) => (
                                  <div
                                    key={participant.id}
                                    className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white"
                                    style={{
                                      backgroundColor:
                                        participant.role === "admin"
                                          ? "#ff9800"
                                          : participant.role === "support"
                                            ? "#9c27b0"
                                            : "#4169e1",
                                    }}
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
                              {thread.participants.length > 3 && (
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white bg-gray-400"
                                  title={`+${thread.participants.length - 3} more`}
                                >
                                  <span className="text-white text-[10px] font-medium">
                                    +{thread.participants.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Timestamp & Unread Badge */}
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

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#4169e1" }}
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4
                  className="text-sm font-semibold mb-1"
                  style={{ color: "#001f54" }}
                >
                  Need help with something?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Click on any conversation to view the full chat history and
                  send messages to your project team.
                </p>
                <button
                  className="text-sm font-medium hover:underline"
                  style={{ color: "#4169e1" }}
                >
                  Learn more about chat threads →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
