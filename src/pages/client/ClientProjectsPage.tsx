import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import {
  Search,
  ChevronDown,
  Calendar,
  MessageCircle,
  ListTree,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronUp,
  CircleDot,
} from "lucide-react";

interface Milestone {
  id: number;
  name: string;
  dueDate: string;
  status: "completed" | "in-progress" | "pending";
}

interface StaffUpdate {
  note: string;
  timestamp: string;
  author: string;
}

interface Project {
  id: number;
  name: string;
  status: "Pending" | "In Progress" | "Completed";
  startDate: string;
  expectedCompletion: string;
  progress: number;
  milestones: Milestone[];
  latestUpdate: StaffUpdate;
}

export default function ClientProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  // Mock projects data
  const allProjects: Project[] = [
    {
      id: 1,
      name: "Website Redesign",
      status: "In Progress",
      startDate: "Dec 1, 2025",
      expectedCompletion: "Jan 25, 2026",
      progress: 73,
      milestones: [
        {
          id: 1,
          name: "Requirements Gathering",
          dueDate: "Dec 5, 2025",
          status: "completed",
        },
        {
          id: 2,
          name: "Wireframe Design",
          dueDate: "Dec 12, 2025",
          status: "completed",
        },
        {
          id: 3,
          name: "UI/UX Design",
          dueDate: "Dec 20, 2025",
          status: "in-progress",
        },
        {
          id: 4,
          name: "Development",
          dueDate: "Jan 10, 2026",
          status: "pending",
        },
        {
          id: 5,
          name: "Testing & QA",
          dueDate: "Jan 20, 2026",
          status: "pending",
        },
        {
          id: 6,
          name: "Final Deployment",
          dueDate: "Jan 25, 2026",
          status: "pending",
        },
      ],
      latestUpdate: {
        note: "UI/UX design phase is progressing well. We have completed 3 out of 5 screens and incorporated your feedback from the last review.",
        timestamp: "2 hours ago",
        author: "Sarah Chen, Project Manager",
      },
    },
    {
      id: 2,
      name: "Mobile App Development",
      status: "In Progress",
      startDate: "Nov 15, 2025",
      expectedCompletion: "Feb 28, 2026",
      progress: 45,
      milestones: [
        {
          id: 1,
          name: "Project Kickoff",
          dueDate: "Nov 18, 2025",
          status: "completed",
        },
        {
          id: 2,
          name: "Backend API Development",
          dueDate: "Dec 15, 2025",
          status: "completed",
        },
        {
          id: 3,
          name: "Mobile UI Implementation",
          dueDate: "Jan 15, 2026",
          status: "in-progress",
        },
        {
          id: 4,
          name: "Integration Testing",
          dueDate: "Feb 10, 2026",
          status: "pending",
        },
        {
          id: 5,
          name: "Beta Launch",
          dueDate: "Feb 28, 2026",
          status: "pending",
        },
      ],
      latestUpdate: {
        note: "Backend API integration is complete. Authentication module has been tested and approved. Moving forward with mobile UI implementation.",
        timestamp: "5 hours ago",
        author: "James Wilson, Lead Developer",
      },
    },
    {
      id: 3,
      name: "Brand Identity Package",
      status: "Pending",
      startDate: "Jan 5, 2026",
      expectedCompletion: "Feb 15, 2026",
      progress: 15,
      milestones: [
        {
          id: 1,
          name: "Brand Discovery Session",
          dueDate: "Jan 8, 2026",
          status: "completed",
        },
        {
          id: 2,
          name: "Logo Concepts",
          dueDate: "Jan 15, 2026",
          status: "in-progress",
        },
        {
          id: 3,
          name: "Brand Guidelines",
          dueDate: "Jan 30, 2026",
          status: "pending",
        },
        {
          id: 4,
          name: "Marketing Collateral",
          dueDate: "Feb 10, 2026",
          status: "pending",
        },
        {
          id: 5,
          name: "Final Delivery",
          dueDate: "Feb 15, 2026",
          status: "pending",
        },
      ],
      latestUpdate: {
        note: "Awaiting your feedback on the three logo concepts we presented. Please review and share your preferences by end of week.",
        timestamp: "1 day ago",
        author: "Maria Rodriguez, Creative Director",
      },
    },
    {
      id: 4,
      name: "E-commerce Platform",
      status: "In Progress",
      startDate: "Oct 1, 2025",
      expectedCompletion: "Jan 30, 2026",
      progress: 88,
      milestones: [
        {
          id: 1,
          name: "Platform Setup",
          dueDate: "Oct 10, 2025",
          status: "completed",
        },
        {
          id: 2,
          name: "Product Catalog Integration",
          dueDate: "Nov 1, 2025",
          status: "completed",
        },
        {
          id: 3,
          name: "Payment Gateway Setup",
          dueDate: "Nov 20, 2025",
          status: "completed",
        },
        {
          id: 4,
          name: "User Testing",
          dueDate: "Dec 15, 2025",
          status: "completed",
        },
        {
          id: 5,
          name: "Security Audit",
          dueDate: "Jan 10, 2026",
          status: "in-progress",
        },
        {
          id: 6,
          name: "Production Launch",
          dueDate: "Jan 30, 2026",
          status: "pending",
        },
      ],
      latestUpdate: {
        note: "Security audit is in progress. Payment gateway integration has been tested successfully. On track for launch at end of month.",
        timestamp: "3 hours ago",
        author: "David Kim, Technical Lead",
      },
    },
    {
      id: 5,
      name: "Marketing Campaign",
      status: "Completed",
      startDate: "Nov 1, 2025",
      expectedCompletion: "Dec 31, 2025",
      progress: 100,
      milestones: [
        {
          id: 1,
          name: "Campaign Strategy",
          dueDate: "Nov 10, 2025",
          status: "completed",
        },
        {
          id: 2,
          name: "Content Creation",
          dueDate: "Nov 25, 2025",
          status: "completed",
        },
        {
          id: 3,
          name: "Campaign Launch",
          dueDate: "Dec 1, 2025",
          status: "completed",
        },
        {
          id: 4,
          name: "Performance Monitoring",
          dueDate: "Dec 20, 2025",
          status: "completed",
        },
        {
          id: 5,
          name: "Final Report",
          dueDate: "Dec 31, 2025",
          status: "completed",
        },
      ],
      latestUpdate: {
        note: "Campaign concluded successfully. Final analytics report has been uploaded. Overall engagement exceeded targets by 23%.",
        timestamp: "2 days ago",
        author: "Emily Thompson, Marketing Director",
      },
    },
    {
      id: 6,
      name: "CRM System Integration",
      status: "In Progress",
      startDate: "Dec 10, 2025",
      expectedCompletion: "Mar 15, 2026",
      progress: 30,
      milestones: [
        {
          id: 1,
          name: "Requirements Analysis",
          dueDate: "Dec 20, 2025",
          status: "completed",
        },
        {
          id: 2,
          name: "Data Migration Planning",
          dueDate: "Jan 5, 2026",
          status: "completed",
        },
        {
          id: 3,
          name: "System Configuration",
          dueDate: "Feb 1, 2026",
          status: "in-progress",
        },
        {
          id: 4,
          name: "Staff Training",
          dueDate: "Feb 25, 2026",
          status: "pending",
        },
        { id: 5, name: "Go Live", dueDate: "Mar 15, 2026", status: "pending" },
      ],
      latestUpdate: {
        note: "Data migration planning completed. Moving into system configuration phase. Training materials are being prepared.",
        timestamp: "6 hours ago",
        author: "Alex Martinez, Solutions Architect",
      },
    },
  ];

  // Filter projects
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleProject = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getStatusStyle = (status: string) => {
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

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <CheckCircle2 className="w-5 h-5" style={{ color: "#4caf50" }} />
        );
      case "in-progress":
        return <Clock className="w-5 h-5" style={{ color: "#4169e1" }} />;
      case "pending":
        return <CircleDot className="w-5 h-5" style={{ color: "#717182" }} />;
      default:
        return <CircleDot className="w-5 h-5" style={{ color: "#717182" }} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="client" />
      <ClientSidebar activeItem="projects" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: "#001f54" }}>
              My Projects
            </h1>
            <p className="text-gray-600 mt-2">
              Track progress and communicate with your project teams
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>

              {/* Date Range Picker */}
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => !e.target.value && (e.target.type = "text")}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                    style={
                      {
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4169e1",
                      } as React.CSSProperties
                    }
                  />
                </div>
                <span className="text-gray-400">–</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => !e.target.value && (e.target.type = "text")}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                    style={
                      {
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4169e1",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredProjects.length}</span>{" "}
              project
              {filteredProjects.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Project Card Header */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Project Name & Status */}
                    <div className="lg:col-span-3">
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "#001f54" }}
                      >
                        {project.name}
                      </h3>
                      <span
                        className="inline-block text-xs px-3 py-1 rounded-full font-medium"
                        style={getStatusStyle(project.status)}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="lg:col-span-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Start:</span>
                          <span className="font-medium text-gray-800">
                            {project.startDate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Due:</span>
                          <span className="font-medium text-gray-800">
                            {project.expectedCompletion}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="lg:col-span-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Progress
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "#4169e1" }}
                          >
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${project.progress}%`,
                              backgroundColor:
                                project.status === "Completed"
                                  ? "#4caf50"
                                  : "#4169e1",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-2">
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{ backgroundColor: "#4169e1", color: "white" }}
                      >
                        <ListTree className="w-4 h-4" />
                        View Timeline
                        {expandedProject === project.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Open Chat
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Section */}
                {expandedProject === project.id && (
                  <div
                    className="border-t px-6 py-6 animate-slideDown"
                    style={{
                      borderColor: "#e5e7eb",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Milestone Timeline */}
                      <div>
                        <h4
                          className="text-lg font-semibold mb-4"
                          style={{ color: "#001f54" }}
                        >
                          Milestone Timeline
                        </h4>
                        <div className="space-y-3">
                          {project.milestones.map((milestone, index) => (
                            <div
                              key={milestone.id}
                              className="flex items-start gap-3 p-3 bg-white rounded-lg border"
                              style={{ borderColor: "#e5e7eb" }}
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                {getMilestoneIcon(milestone.status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-sm font-medium mb-1"
                                  style={{ color: "#001f54" }}
                                >
                                  {milestone.name}
                                </h5>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  Due: {milestone.dueDate}
                                </div>
                              </div>
                              <span
                                className="text-xs px-2 py-1 rounded-full font-medium capitalize"
                                style={{
                                  backgroundColor:
                                    milestone.status === "completed"
                                      ? "#4caf5020"
                                      : milestone.status === "in-progress"
                                        ? "#4169e120"
                                        : "#71718220",
                                  color:
                                    milestone.status === "completed"
                                      ? "#4caf50"
                                      : milestone.status === "in-progress"
                                        ? "#4169e1"
                                        : "#717182",
                                }}
                              >
                                {milestone.status.replace("-", " ")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Latest Staff Update & CTA */}
                      <div>
                        <h4
                          className="text-lg font-semibold mb-4"
                          style={{ color: "#001f54" }}
                        >
                          Latest Update
                        </h4>
                        <div
                          className="bg-white rounded-lg border p-4 mb-4"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
                              style={{ backgroundColor: "#4169e1" }}
                            >
                              {project.latestUpdate.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="flex-1">
                              <p
                                className="text-sm font-medium mb-1"
                                style={{ color: "#001f54" }}
                              >
                                {project.latestUpdate.author}
                              </p>
                              <p className="text-xs text-gray-500">
                                {project.latestUpdate.timestamp}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {project.latestUpdate.note}
                          </p>
                        </div>

                        {/* Progress Indicator (Read-only) */}
                        <div
                          className="bg-white rounded-lg border p-4 mb-4"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Overall Progress
                            </span>
                            <span
                              className="text-lg font-bold"
                              style={{ color: "#4169e1" }}
                            >
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${project.progress}%`,
                                backgroundColor:
                                  project.status === "Completed"
                                    ? "#4caf50"
                                    : "#4169e1",
                              }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {
                              project.milestones.filter(
                                (m) => m.status === "completed",
                              ).length
                            }{" "}
                            of {project.milestones.length} milestones completed
                          </p>
                        </div>

                        {/* Primary CTA */}
                        <button
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
                          style={{
                            backgroundColor: "#a7fc00",
                            color: "#001f54",
                          }}
                        >
                          <MessageCircle className="w-5 h-5" />
                          Open Project Chat
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <AlertCircle
                    className="w-8 h-8"
                    style={{ color: "#4169e1" }}
                  />
                </div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#001f54" }}
                >
                  No projects found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria to find what
                  you're looking for.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
