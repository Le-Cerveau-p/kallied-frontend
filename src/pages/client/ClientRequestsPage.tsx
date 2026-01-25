import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import {
  Plus,
  X,
  Send,
  Calendar,
  FolderKanban,
  MessageCircle,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Tag,
  Search,
  Filter,
} from "lucide-react";

interface StatusHistoryItem {
  status: "Open" | "In Review" | "Resolved";
  timestamp: string;
  updatedBy: string;
}

interface ConversationMessage {
  id: number;
  sender: string;
  role: "client" | "staff" | "admin";
  message: string;
  timestamp: string;
}

interface Request {
  id: number;
  title: string;
  description: string;
  status: "Open" | "In Review" | "Resolved";
  priority: "Low" | "Medium" | "High";
  category: "Bug" | "Feature Request" | "Change Request" | "Question";
  projectName: string;
  createdDate: string;
  lastUpdated: string;
  statusHistory: StatusHistoryItem[];
  conversation: ConversationMessage[];
}

export default function ClientRequestsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [newMessage, setNewMessage] = useState("");

  // New request form state
  const [newRequestTitle, setNewRequestTitle] = useState("");
  const [newRequestDescription, setNewRequestDescription] = useState("");
  const [newRequestProject, setNewRequestProject] = useState("");
  const [newRequestCategory, setNewRequestCategory] = useState("Question");
  const [newRequestPriority, setNewRequestPriority] = useState("Medium");

  // Mock requests data
  const allRequests: Request[] = [
    {
      id: 1,
      title: "Homepage animation not working on mobile",
      description:
        "The hero section animation stutters on iOS Safari. Works fine on desktop browsers but has performance issues on mobile devices.",
      status: "In Review",
      priority: "High",
      category: "Bug",
      projectName: "Website Redesign",
      createdDate: "Jan 20, 2026",
      lastUpdated: "2 hours ago",
      statusHistory: [
        {
          status: "Open",
          timestamp: "Jan 20, 2026 at 9:30 AM",
          updatedBy: "System",
        },
        {
          status: "In Review",
          timestamp: "Jan 20, 2026 at 2:15 PM",
          updatedBy: "Sarah Chen",
        },
      ],
      conversation: [
        {
          id: 1,
          sender: "You",
          role: "client",
          message:
            "The hero section animation stutters on iOS Safari. Works fine on desktop browsers but has performance issues on mobile devices.",
          timestamp: "Jan 20, 2026 at 9:30 AM",
        },
        {
          id: 2,
          sender: "Sarah Chen",
          role: "staff",
          message:
            "Thanks for reporting this! I've reproduced the issue on my iPhone 14. It looks like the animation is too complex for mobile GPUs. We'll optimize it and push an update by end of day.",
          timestamp: "Jan 20, 2026 at 2:15 PM",
        },
        {
          id: 3,
          sender: "You",
          role: "client",
          message: "Great, thank you for the quick response!",
          timestamp: "Jan 20, 2026 at 2:45 PM",
        },
      ],
    },
    {
      id: 2,
      title: "Add dark mode to user dashboard",
      description:
        "Would like to have a dark mode option for the user dashboard to reduce eye strain during evening work sessions.",
      status: "Open",
      priority: "Medium",
      category: "Feature Request",
      projectName: "Website Redesign",
      createdDate: "Jan 19, 2026",
      lastUpdated: "1 day ago",
      statusHistory: [
        {
          status: "Open",
          timestamp: "Jan 19, 2026 at 11:20 AM",
          updatedBy: "System",
        },
      ],
      conversation: [
        {
          id: 1,
          sender: "You",
          role: "client",
          message:
            "Would like to have a dark mode option for the user dashboard to reduce eye strain during evening work sessions.",
          timestamp: "Jan 19, 2026 at 11:20 AM",
        },
        {
          id: 2,
          sender: "Emily Thompson",
          role: "admin",
          message:
            "We've added this to our backlog. We'll review it in our next sprint planning meeting and provide an estimate.",
          timestamp: "Jan 19, 2026 at 3:00 PM",
        },
      ],
    },
    {
      id: 3,
      title: "Update contact form validation",
      description:
        "The contact form should accept international phone numbers. Currently only accepts US format.",
      status: "Resolved",
      priority: "Low",
      category: "Change Request",
      projectName: "Website Redesign",
      createdDate: "Jan 15, 2026",
      lastUpdated: "5 days ago",
      statusHistory: [
        {
          status: "Open",
          timestamp: "Jan 15, 2026 at 10:00 AM",
          updatedBy: "System",
        },
        {
          status: "In Review",
          timestamp: "Jan 16, 2026 at 9:30 AM",
          updatedBy: "David Kim",
        },
        {
          status: "Resolved",
          timestamp: "Jan 18, 2026 at 4:45 PM",
          updatedBy: "David Kim",
        },
      ],
      conversation: [
        {
          id: 1,
          sender: "You",
          role: "client",
          message:
            "The contact form should accept international phone numbers. Currently only accepts US format.",
          timestamp: "Jan 15, 2026 at 10:00 AM",
        },
        {
          id: 2,
          sender: "David Kim",
          role: "staff",
          message:
            "Good catch! I'll update the validation to support international formats using libphonenumber.",
          timestamp: "Jan 16, 2026 at 9:30 AM",
        },
        {
          id: 3,
          sender: "David Kim",
          role: "staff",
          message:
            "This has been deployed. The form now accepts phone numbers from all countries. Please test and let me know if you find any issues.",
          timestamp: "Jan 18, 2026 at 4:45 PM",
        },
        {
          id: 4,
          sender: "You",
          role: "client",
          message:
            "Tested with UK and Australian numbers - works perfectly. Thanks!",
          timestamp: "Jan 18, 2026 at 5:30 PM",
        },
      ],
    },
    {
      id: 4,
      title: "API authentication endpoint documentation",
      description:
        "Need clarification on the OAuth2 flow for the mobile app API integration.",
      status: "In Review",
      priority: "High",
      category: "Question",
      projectName: "Mobile App Development",
      createdDate: "Jan 18, 2026",
      lastUpdated: "3 days ago",
      statusHistory: [
        {
          status: "Open",
          timestamp: "Jan 18, 2026 at 2:00 PM",
          updatedBy: "System",
        },
        {
          status: "In Review",
          timestamp: "Jan 19, 2026 at 10:15 AM",
          updatedBy: "James Wilson",
        },
      ],
      conversation: [
        {
          id: 1,
          sender: "You",
          role: "client",
          message:
            "Need clarification on the OAuth2 flow for the mobile app API integration. What are the required scopes?",
          timestamp: "Jan 18, 2026 at 2:00 PM",
        },
        {
          id: 2,
          sender: "James Wilson",
          role: "staff",
          message:
            "I'll prepare detailed documentation with code examples. Should have this ready for you by tomorrow.",
          timestamp: "Jan 19, 2026 at 10:15 AM",
        },
      ],
    },
  ];

  const projects = [
    "Website Redesign",
    "Mobile App Development",
    "E-commerce Platform",
    "Brand Identity Package",
  ];

  // Filter requests
  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateRequest = () => {
    // Handle request creation
    console.log("Creating request:", {
      title: newRequestTitle,
      description: newRequestDescription,
      project: newRequestProject,
      category: newRequestCategory,
      priority: newRequestPriority,
    });
    // Reset form and close modal
    setNewRequestTitle("");
    setNewRequestDescription("");
    setNewRequestProject("");
    setNewRequestCategory("Question");
    setNewRequestPriority("Medium");
    setShowCreateModal(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Open":
        return {
          backgroundColor: "#4169e120",
          color: "#4169e1",
          icon: AlertCircle,
        };
      case "In Review":
        return { backgroundColor: "#ff980020", color: "#ff9800", icon: Clock };
      case "Resolved":
        return {
          backgroundColor: "#32cd3220",
          color: "#32cd32",
          icon: CheckCircle,
        };
      default:
        return {
          backgroundColor: "#71718220",
          color: "#717182",
          icon: AlertCircle,
        };
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "High":
        return { backgroundColor: "#dc262620", color: "#dc2626" };
      case "Medium":
        return { backgroundColor: "#ff980020", color: "#ff9800" };
      case "Low":
        return { backgroundColor: "#71718220", color: "#717182" };
      default:
        return { backgroundColor: "#71718220", color: "#717182" };
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "Bug":
        return { backgroundColor: "#dc262620", color: "#dc2626" };
      case "Feature Request":
        return { backgroundColor: "#9333ea20", color: "#9333ea" };
      case "Change Request":
        return { backgroundColor: "#4169e120", color: "#4169e1" };
      case "Question":
        return { backgroundColor: "#16a34a20", color: "#16a34a" };
      default:
        return { backgroundColor: "#71718220", color: "#717182" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="client" />
      <ClientSidebar activeItem="requests" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
                  Support Requests
                </h1>
                <p className="text-gray-600">
                  Submit and track project-related requests
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                <Plus className="w-5 h-5" />
                New Request
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search requests..."
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

              {/* Status Filter */}
              <div className="relative">
                <Filter
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option>All Status</option>
                  <option>Open</option>
                  <option>In Review</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Request List */}
          {!selectedRequest ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {filteredRequests.length === 0 ? (
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
                    No requests found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or create a new request.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                    style={{ backgroundColor: "#4169e1", color: "white" }}
                  >
                    <Plus className="w-5 h-5" />
                    Create New Request
                  </button>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                  {filteredRequests.map((request) => {
                    const statusStyle = getStatusStyle(request.status);
                    const StatusIcon = statusStyle.icon;

                    return (
                      <button
                        key={request.id}
                        onClick={() => setSelectedRequest(request)}
                        className="w-full text-left p-6 hover:bg-gray-50 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            {/* Title and Badges */}
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 flex-1">
                                {request.title}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <span
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                                style={statusStyle}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {request.status}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                                style={getCategoryStyle(request.category)}
                              >
                                <Tag className="w-3 h-3" />
                                {request.category}
                              </span>
                              <span
                                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                                style={getPriorityStyle(request.priority)}
                              >
                                {request.priority} Priority
                              </span>
                            </div>

                            {/* Description Preview */}
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {request.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FolderKanban className="w-3.5 h-3.5" />
                                {request.projectName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Created {request.createdDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Updated {request.lastUpdated}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Request Detail View */
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex items-center gap-2 mb-4 text-sm font-medium transition-all hover:underline"
                style={{ color: "#4169e1" }}
              >
                ← Back to all requests
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Conversation */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Request Header */}
                    <div
                      className="p-6 border-b"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <h2
                          className="text-2xl font-semibold flex-1"
                          style={{ color: "#001f54" }}
                        >
                          {selectedRequest.title}
                        </h2>
                        {(() => {
                          const statusStyle = getStatusStyle(
                            selectedRequest.status,
                          );
                          const StatusIcon = statusStyle.icon;
                          return (
                            <span
                              className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full font-medium"
                              style={statusStyle}
                            >
                              <StatusIcon className="w-4 h-4" />
                              {selectedRequest.status}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                          style={getCategoryStyle(selectedRequest.category)}
                        >
                          <Tag className="w-3 h-3" />
                          {selectedRequest.category}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                          style={getPriorityStyle(selectedRequest.priority)}
                        >
                          {selectedRequest.priority} Priority
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FolderKanban className="w-4 h-4" />
                          {selectedRequest.projectName}
                        </span>
                      </div>
                    </div>

                    {/* Conversation Timeline */}
                    <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
                      {selectedRequest.conversation.map((msg) => (
                        <div key={msg.id} className="flex gap-4">
                          {/* Avatar */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium"
                            style={{
                              backgroundColor:
                                msg.role === "client"
                                  ? "#4169e1"
                                  : msg.role === "admin"
                                    ? "#ff9800"
                                    : "#32cd32",
                            }}
                          >
                            {msg.sender
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-gray-500">
                                {msg.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {msg.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    <div
                      className="p-6 border-t"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
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
                          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                          style={{ backgroundColor: "#4169e1", color: "white" }}
                        >
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar - Status History */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3
                      className="font-semibold mb-4"
                      style={{ color: "#001f54" }}
                    >
                      Status History
                    </h3>
                    <div className="space-y-4">
                      {selectedRequest.statusHistory.map((item, index) => {
                        const statusStyle = getStatusStyle(item.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                          <div key={index} className="flex gap-3">
                            {/* Status Icon */}
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: statusStyle.backgroundColor,
                              }}
                            >
                              <StatusIcon
                                className="w-4 h-4"
                                style={{ color: statusStyle.color }}
                              />
                            </div>

                            {/* Status Info */}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.status}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.timestamp}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <User className="w-3 h-3" />
                                {item.updatedBy}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Request Details */}
                    <div
                      className="mt-6 pt-6 border-t"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Request Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Created</p>
                          <p className="text-gray-900">
                            {selectedRequest.createdDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Last Updated
                          </p>
                          <p className="text-gray-900">
                            {selectedRequest.lastUpdated}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Request ID
                          </p>
                          <p className="text-gray-900">
                            #{selectedRequest.id.toString().padStart(5, "0")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#001f54" }}
              >
                Create New Request
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Title *
                </label>
                <input
                  type="text"
                  placeholder="Brief summary of your request..."
                  value={newRequestTitle}
                  onChange={(e) => setNewRequestTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Related Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Project *
                </label>
                <select
                  value={newRequestProject}
                  onChange={(e) => setNewRequestProject(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option value="">Select a project...</option>
                  {projects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={newRequestCategory}
                  onChange={(e) => setNewRequestCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option value="Question">Question</option>
                  <option value="Bug">Bug</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Change Request">Change Request</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Low", "Medium", "High"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewRequestPriority(priority)}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-all ${
                        newRequestPriority === priority
                          ? "text-white"
                          : "hover:bg-gray-50"
                      }`}
                      style={{
                        backgroundColor:
                          newRequestPriority === priority
                            ? "#4169e1"
                            : "transparent",
                        borderColor:
                          newRequestPriority === priority
                            ? "#4169e1"
                            : "#e5e7eb",
                        color:
                          newRequestPriority === priority ? "white" : "#374151",
                      }}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Provide detailed information about your request..."
                  value={newRequestDescription}
                  onChange={(e) => setNewRequestDescription(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: "#e5e7eb" }}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 border rounded-lg font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRequest}
                disabled={
                  !newRequestTitle ||
                  !newRequestProject ||
                  !newRequestDescription
                }
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                Create Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
