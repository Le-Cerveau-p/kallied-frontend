import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
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

interface Message {
  id: number;
  sender: string;
  role: "client" | "staff" | "admin";
  content: string;
  timestamp: string;
  attachments?: { name: string; type: string }[];
}

interface Thread {
  id: number;
  projectId: number;
  projectName: string;
  threadType: "Main" | "Staff";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: string[];
  messages: Message[];
}

export default function StaffMessagesPage() {
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Main" | "Staff">("All");

  // Mock threads data
  const allThreads: Thread[] = [
    {
      id: 1,
      projectId: 1,
      projectName: "Website Redesign",
      threadType: "Main",
      lastMessage:
        "The latest designs look great! When can we expect the staging environment?",
      lastMessageTime: "Jan 21, 2026 at 2:45 PM",
      unreadCount: 2,
      participants: [
        "John Smith (Client)",
        "Emily Davis",
        "Sarah Chen",
        "Mike Johnson",
      ],
      messages: [
        {
          id: 1,
          sender: "John Smith",
          role: "client",
          content:
            "Hi team, thanks for the update. Can you share the timeline for the next phase?",
          timestamp: "Jan 20, 2026 at 9:30 AM",
        },
        {
          id: 2,
          sender: "Emily Davis",
          role: "staff",
          content:
            "Absolutely! We're planning to complete development by Jan 25, then move to testing. I'll send you a detailed timeline today.",
          timestamp: "Jan 20, 2026 at 10:15 AM",
        },
        {
          id: 3,
          sender: "John Smith",
          role: "client",
          content:
            "The latest designs look great! When can we expect the staging environment?",
          timestamp: "Jan 21, 2026 at 2:45 PM",
        },
      ],
    },
    {
      id: 2,
      projectId: 1,
      projectName: "Website Redesign",
      threadType: "Staff",
      lastMessage:
        "Can someone review the mobile navigation code? I want to make sure it's accessible.",
      lastMessageTime: "Jan 18, 2026 at 3:20 PM",
      unreadCount: 0,
      participants: ["Emily Davis", "Sarah Chen", "Mike Johnson"],
      messages: [
        {
          id: 1,
          sender: "Sarah Chen",
          role: "staff",
          content:
            "The client approved all mockups. We can proceed with development.",
          timestamp: "Jan 15, 2026 at 11:00 AM",
        },
        {
          id: 2,
          sender: "Mike Johnson",
          role: "staff",
          content: "Great! I'll start with the homepage components today.",
          timestamp: "Jan 15, 2026 at 11:30 AM",
        },
        {
          id: 3,
          sender: "Mike Johnson",
          role: "staff",
          content:
            "Can someone review the mobile navigation code? I want to make sure it's accessible.",
          timestamp: "Jan 18, 2026 at 3:20 PM",
        },
      ],
    },
    {
      id: 3,
      projectId: 2,
      projectName: "Mobile App Development",
      threadType: "Main",
      lastMessage: "Perfect! Looking forward to the next update.",
      lastMessageTime: "Jan 20, 2026 at 4:15 PM",
      unreadCount: 0,
      participants: ["Lisa Anderson (Client)", "David Kim", "Mike Johnson"],
      messages: [
        {
          id: 1,
          sender: "Lisa Anderson",
          role: "client",
          content: "Hi team, just checking in on the API integration progress.",
          timestamp: "Jan 20, 2026 at 1:00 PM",
        },
        {
          id: 2,
          sender: "David Kim",
          role: "staff",
          content:
            "We've completed 80% of the API endpoints. All the critical ones are working perfectly. We'll have the rest done by end of week.",
          timestamp: "Jan 20, 2026 at 2:30 PM",
        },
        {
          id: 3,
          sender: "Lisa Anderson",
          role: "client",
          content: "Perfect! Looking forward to the next update.",
          timestamp: "Jan 20, 2026 at 4:15 PM",
        },
      ],
    },
    {
      id: 4,
      projectId: 2,
      projectName: "Mobile App Development",
      threadType: "Staff",
      lastMessage: "I'll take a look and provide feedback by tomorrow.",
      lastMessageTime: "Jan 21, 2026 at 10:00 AM",
      unreadCount: 1,
      participants: ["David Kim", "Mike Johnson", "Emily Davis"],
      messages: [
        {
          id: 1,
          sender: "David Kim",
          role: "staff",
          content:
            "I've finished the authentication flow. Can someone test it on iOS?",
          timestamp: "Jan 20, 2026 at 5:00 PM",
        },
        {
          id: 2,
          sender: "Mike Johnson",
          role: "staff",
          content: "I'll take a look and provide feedback by tomorrow.",
          timestamp: "Jan 21, 2026 at 10:00 AM",
        },
      ],
    },
    {
      id: 5,
      projectId: 3,
      projectName: "E-commerce Platform",
      threadType: "Main",
      lastMessage: "Thank you for the quick turnaround!",
      lastMessageTime: "Jan 19, 2026 at 3:30 PM",
      unreadCount: 0,
      participants: ["Robert Chen (Client)", "Jordan Lee", "Sarah Chen"],
      messages: [
        {
          id: 1,
          sender: "Robert Chen",
          role: "client",
          content: "The payment integration is working smoothly. Great work!",
          timestamp: "Jan 19, 2026 at 3:00 PM",
        },
        {
          id: 2,
          sender: "Jordan Lee",
          role: "staff",
          content:
            "Thanks Robert! We ran extensive tests to ensure everything is secure and stable.",
          timestamp: "Jan 19, 2026 at 3:15 PM",
        },
        {
          id: 3,
          sender: "Robert Chen",
          role: "client",
          content: "Thank you for the quick turnaround!",
          timestamp: "Jan 19, 2026 at 3:30 PM",
        },
      ],
    },
    {
      id: 6,
      projectId: 4,
      projectName: "Brand Identity Package",
      threadType: "Main",
      lastMessage: "We'll schedule a presentation for next week.",
      lastMessageTime: "Jan 22, 2026 at 11:45 AM",
      unreadCount: 3,
      participants: ["Maria Garcia (Client)", "Sarah Chen", "Emily Davis"],
      messages: [
        {
          id: 1,
          sender: "Maria Garcia",
          role: "client",
          content:
            "Can we schedule a call to review the final brand guidelines?",
          timestamp: "Jan 22, 2026 at 9:00 AM",
        },
        {
          id: 2,
          sender: "Sarah Chen",
          role: "staff",
          content:
            "Absolutely! I have availability on Tuesday or Thursday afternoon. Which works better for you?",
          timestamp: "Jan 22, 2026 at 10:30 AM",
        },
        {
          id: 3,
          sender: "Maria Garcia",
          role: "client",
          content: "Thursday works perfectly. Let's do 2 PM.",
          timestamp: "Jan 22, 2026 at 11:00 AM",
        },
        {
          id: 4,
          sender: "Sarah Chen",
          role: "staff",
          content: "We'll schedule a presentation for next week.",
          timestamp: "Jan 22, 2026 at 11:45 AM",
        },
      ],
    },
    {
      id: 7,
      projectId: 5,
      projectName: "CRM System Integration",
      threadType: "Staff",
      lastMessage: "Database migration is scheduled for this weekend.",
      lastMessageTime: "Jan 23, 2026 at 9:15 AM",
      unreadCount: 1,
      participants: ["Mike Johnson", "David Kim", "Jordan Lee"],
      messages: [
        {
          id: 1,
          sender: "Mike Johnson",
          role: "staff",
          content:
            "We need to coordinate the database migration. Any concerns?",
          timestamp: "Jan 23, 2026 at 8:00 AM",
        },
        {
          id: 2,
          sender: "Jordan Lee",
          role: "staff",
          content: "Database migration is scheduled for this weekend.",
          timestamp: "Jan 23, 2026 at 9:15 AM",
        },
      ],
    },
  ];

  // Filter threads
  const filteredThreads = allThreads.filter((thread) => {
    const matchesSearch =
      searchQuery === "" ||
      thread.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "All" || thread.threadType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Group threads by project
  const groupedThreads = filteredThreads.reduce(
    (acc, thread) => {
      if (!acc[thread.projectName]) {
        acc[thread.projectName] = [];
      }
      acc[thread.projectName].push(thread);
      return acc;
    },
    {} as Record<string, Thread[]>,
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedThread) {
      console.log(
        "Sending message:",
        newMessage,
        "to thread:",
        selectedThread.projectName,
      );
      setNewMessage("");
    }
  };

  const totalUnreadCount = allThreads.reduce(
    (sum, thread) => sum + thread.unreadCount,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <StaffSidebar activeItem="messages" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {!selectedThread ? (
            <>
              {/* Page Header */}
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
                        • {totalUnreadCount} unread
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
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

                  {/* Filter */}
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

              {/* Thread List Grouped by Project */}
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
                    ([projectName, threads]) => (
                      <div key={projectName}>
                        {/* Project Header */}
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
                            ({threads.length})
                          </span>
                        </div>

                        {/* Threads for this project */}
                        <div className="space-y-3 mb-6">
                          {threads.map((thread) => (
                            <button
                              key={thread.id}
                              onClick={() => setSelectedThread(thread)}
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
                                    <span>•</span>
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
            // Thread View
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Thread Header */}
              <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => setSelectedThread(null)}
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

              {/* Messages */}
              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {selectedThread.messages.map((message) => (
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
                        <p className="text-sm text-gray-900">
                          {message.content}
                        </p>
                      </div>
                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {message.attachments.map((attachment, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm"
                                style={{ borderColor: "#e5e7eb" }}
                              >
                                <Paperclip className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-700">
                                  {attachment.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <div className="p-6 border-t" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex gap-2 mb-3">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Upload image"
                  >
                    <Image className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
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
                    disabled={!newMessage.trim()}
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
