import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  X,
  UserPlus,
  UserMinus,
  FileText,
  AlertCircle,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  client: string;
  status: "Pending" | "In Progress" | "Completed";
  assignedStaff: string[];
  startDate: string;
  expectedCompletion: string;
  budget: string;
  description: string;
  approvalHistory: ApprovalEvent[];
  updates: ProjectUpdate[];
}

interface ApprovalEvent {
  id: number;
  action: string;
  approvedBy: string;
  date: string;
}

interface ProjectUpdate {
  id: number;
  title: string;
  description: string;
  date: string;
  author: string;
}

export default function AdminProjectsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "In Progress" | "Completed"
  >("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAssignStaffDialog, setShowAssignStaffDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);

  // Mock project data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "E-Commerce Platform Redesign",
      client: "TechCorp Inc.",
      status: "In Progress",
      assignedStaff: ["Sarah Johnson", "Mike Chen"],
      startDate: "Jan 10, 2026",
      expectedCompletion: "Mar 15, 2026",
      budget: "$45,000",
      description:
        "Complete redesign of the e-commerce platform with modern UI/UX and improved performance.",
      approvalHistory: [
        {
          id: 1,
          action: "Project Approved",
          approvedBy: "Admin",
          date: "Jan 8, 2026",
        },
        {
          id: 2,
          action: "Budget Approved",
          approvedBy: "Admin",
          date: "Jan 9, 2026",
        },
      ],
      updates: [
        {
          id: 1,
          title: "Design Phase Completed",
          description: "All wireframes and mockups approved by client",
          date: "Jan 20, 2026",
          author: "Sarah Johnson",
        },
        {
          id: 2,
          title: "Development Started",
          description: "Frontend development in progress",
          date: "Jan 25, 2026",
          author: "Mike Chen",
        },
      ],
    },
    {
      id: 2,
      name: "Mobile App Development",
      client: "StartupXYZ",
      status: "Pending",
      assignedStaff: [],
      startDate: "Feb 1, 2026",
      expectedCompletion: "Apr 30, 2026",
      budget: "$32,000",
      description:
        "Native mobile app for iOS and Android platforms with user authentication and payment integration.",
      approvalHistory: [],
      updates: [],
    },
    {
      id: 3,
      name: "Cloud Migration Project",
      client: "Enterprise Co.",
      status: "Pending",
      assignedStaff: [],
      startDate: "Feb 5, 2026",
      expectedCompletion: "May 20, 2026",
      budget: "$78,000",
      description:
        "Migration of on-premise infrastructure to AWS cloud with zero downtime requirement.",
      approvalHistory: [],
      updates: [],
    },
    {
      id: 4,
      name: "Website Redesign",
      client: "Creative Agency",
      status: "Completed",
      assignedStaff: ["Emily Rodriguez", "David Kim"],
      startDate: "Nov 1, 2025",
      expectedCompletion: "Dec 15, 2025",
      budget: "$28,000",
      description:
        "Complete website redesign with modern design and responsive layout.",
      approvalHistory: [
        {
          id: 1,
          action: "Project Approved",
          approvedBy: "Admin",
          date: "Oct 28, 2025",
        },
        {
          id: 2,
          action: "Project Completed",
          approvedBy: "Admin",
          date: "Dec 15, 2025",
        },
      ],
      updates: [
        {
          id: 1,
          title: "Design Approved",
          description: "Client approved all designs",
          date: "Nov 10, 2025",
          author: "Emily Rodriguez",
        },
        {
          id: 2,
          title: "Development Complete",
          description: "All pages deployed to production",
          date: "Dec 12, 2025",
          author: "David Kim",
        },
      ],
    },
    {
      id: 5,
      name: "API Integration Project",
      client: "FinTech Solutions",
      status: "In Progress",
      assignedStaff: ["Lisa Anderson"],
      startDate: "Jan 15, 2026",
      expectedCompletion: "Feb 28, 2026",
      budget: "$18,500",
      description:
        "Integration with third-party payment APIs and compliance system.",
      approvalHistory: [
        {
          id: 1,
          action: "Project Approved",
          approvedBy: "Admin",
          date: "Jan 12, 2026",
        },
      ],
      updates: [
        {
          id: 1,
          title: "API Documentation Review",
          description: "Reviewed all API documentation",
          date: "Jan 18, 2026",
          author: "Lisa Anderson",
        },
      ],
    },
  ]);

  // Available staff for assignment
  const availableStaff = [
    "Sarah Johnson",
    "Mike Chen",
    "Emily Rodriguez",
    "David Kim",
    "Lisa Anderson",
    "Robert Wilson",
    "Jennifer Taylor",
    "Michael Brown",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff3e0", text: "#ff9800" };
      case "In Progress":
        return { bg: "#e3f2fd", text: "#4169e1" };
      case "Completed":
        return { bg: "#f1f8e9", text: "#558b2f" };
      default:
        return { bg: "#f5f5f5", text: "#717182" };
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApproveProject = () => {
    if (selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                status: "In Progress",
                approvalHistory: [
                  ...p.approvalHistory,
                  {
                    id: p.approvalHistory.length + 1,
                    action: "Project Approved",
                    approvedBy: "Admin",
                    date: "Jan 24, 2026",
                  },
                ],
              }
            : p,
        ),
      );
      setShowApproveDialog(false);
      setSelectedProject(null);
    }
  };

  const handleCompleteProject = () => {
    if (selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                status: "Completed",
                approvalHistory: [
                  ...p.approvalHistory,
                  {
                    id: p.approvalHistory.length + 1,
                    action: "Project Completed",
                    approvedBy: "Admin",
                    date: "Jan 24, 2026",
                  },
                ],
              }
            : p,
        ),
      );
      setShowCompleteDialog(false);
      setSelectedProject(null);
    }
  };

  const handleAssignStaff = (staffName: string) => {
    if (selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id
            ? { ...p, assignedStaff: [...p.assignedStaff, staffName] }
            : p,
        ),
      );
      setSelectedProject({
        ...selectedProject,
        assignedStaff: [...selectedProject.assignedStaff, staffName],
      });
    }
  };

  const handleRemoveStaff = (staffName: string) => {
    if (selectedProject) {
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id
            ? {
                ...p,
                assignedStaff: p.assignedStaff.filter((s) => s !== staffName),
              }
            : p,
        ),
      );
      setSelectedProject({
        ...selectedProject,
        assignedStaff: selectedProject.assignedStaff.filter(
          (s) => s !== staffName,
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="projects" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: "#001f54" }}>
              Projects Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage projects, assign staff, and approve project requests
            </p>
          </div>

          {selectedProject ? (
            // Project Details View
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="flex items-center gap-2 text-sm hover:underline"
                style={{ color: "#4169e1" }}
              >
                ← Back to Projects
              </button>

              {/* Project Header */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl mb-2" style={{ color: "#001f54" }}>
                      {selectedProject.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span>Client: {selectedProject.client}</span>
                      <span>•</span>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: getStatusColor(
                            selectedProject.status,
                          ).bg,
                          color: getStatusColor(selectedProject.status).text,
                        }}
                      >
                        {selectedProject.status}
                      </span>
                      <span>•</span>
                      <span>Budget: {selectedProject.budget}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.status === "Pending" && (
                      <button
                        onClick={() => setShowApproveDialog(true)}
                        className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve Project
                      </button>
                    )}
                    {selectedProject.status === "In Progress" && (
                      <button
                        onClick={() => setShowCompleteDialog(true)}
                        className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        style={{ backgroundColor: "#558b2f" }}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Completed
                      </button>
                    )}
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      style={{ backgroundColor: "#4169e1" }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Main Chat
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                      style={{ backgroundColor: "#001f54" }}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Staff Chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Project Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Project Details */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl mb-4" style={{ color: "#001f54" }}>
                      Project Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-600">
                          Description
                        </label>
                        <p className="mt-1 text-gray-800">
                          {selectedProject.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">
                            Start Date
                          </label>
                          <p
                            className="mt-1 font-medium"
                            style={{ color: "#001f54" }}
                          >
                            {selectedProject.startDate}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">
                            Expected Completion
                          </label>
                          <p
                            className="mt-1 font-medium"
                            style={{ color: "#001f54" }}
                          >
                            {selectedProject.expectedCompletion}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Timeline & Updates */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl mb-4" style={{ color: "#001f54" }}>
                      Project Timeline & Updates
                    </h3>
                    {selectedProject.updates.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No updates yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {selectedProject.updates.map((update) => (
                          <div
                            key={update.id}
                            className="border-l-4 border-blue-500 pl-4 py-2"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4
                                className="font-medium"
                                style={{ color: "#001f54" }}
                              >
                                {update.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {update.date}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {update.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              by {update.author}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Approval History */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl mb-4" style={{ color: "#001f54" }}>
                      Approval History
                    </h3>
                    {selectedProject.approvalHistory.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No approval history
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedProject.approvalHistory.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: "#f1f8e9" }}
                              >
                                <CheckCircle
                                  className="w-4 h-4"
                                  style={{ color: "#558b2f" }}
                                />
                              </div>
                              <div>
                                <p
                                  className="font-medium text-sm"
                                  style={{ color: "#001f54" }}
                                >
                                  {event.action}
                                </p>
                                <p className="text-xs text-gray-500">
                                  by {event.approvedBy}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {event.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Assigned Staff */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl" style={{ color: "#001f54" }}>
                        Assigned Staff
                      </h3>
                      <button
                        onClick={() => setShowAssignStaffDialog(true)}
                        className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        style={{ color: "#4169e1" }}
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                    {selectedProject.assignedStaff.length === 0 ? (
                      <p className="text-gray-500 text-center py-8 text-sm">
                        No staff assigned yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedProject.assignedStaff.map((staff) => (
                          <div
                            key={staff}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                                style={{ backgroundColor: "#4169e1" }}
                              >
                                {staff
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <span
                                className="text-sm font-medium"
                                style={{ color: "#001f54" }}
                              >
                                {staff}
                              </span>
                            </div>
                            <button
                              onClick={() => handleRemoveStaff(staff)}
                              className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                              style={{ color: "#d4183d" }}
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Stats */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl mb-4" style={{ color: "#001f54" }}>
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Team Size</span>
                        <span
                          className="font-medium"
                          style={{ color: "#001f54" }}
                        >
                          {selectedProject.assignedStaff.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Updates</span>
                        <span
                          className="font-medium"
                          style={{ color: "#001f54" }}
                        >
                          {selectedProject.updates.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Approvals</span>
                        <span
                          className="font-medium"
                          style={{ color: "#001f54" }}
                        >
                          {selectedProject.approvalHistory.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Project List View
            <>
              {/* Top Controls */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects by name or client..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="relative sm:w-48">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Create Project Button */}
                  <button
                    onClick={() => setShowCreateProjectDialog(true)}
                    className="px-6 py-3 rounded-lg text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
                    style={{ backgroundColor: "#4169e1" }}
                  >
                    <Plus className="w-5 h-5" />
                    Create Project
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "#e3f2fd" }}
                    >
                      <FileText
                        className="w-5 h-5"
                        style={{ color: "#4169e1" }}
                      />
                    </div>
                    <h3 className="text-gray-600 text-sm">Total Projects</h3>
                  </div>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {projects.length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "#fff3e0" }}
                    >
                      <AlertCircle
                        className="w-5 h-5"
                        style={{ color: "#ff9800" }}
                      />
                    </div>
                    <h3 className="text-gray-600 text-sm">Pending Approval</h3>
                  </div>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {projects.filter((p) => p.status === "Pending").length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "#e3f2fd" }}
                    >
                      <Clock className="w-5 h-5" style={{ color: "#4169e1" }} />
                    </div>
                    <h3 className="text-gray-600 text-sm">In Progress</h3>
                  </div>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {projects.filter((p) => p.status === "In Progress").length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "#f1f8e9" }}
                    >
                      <CheckCircle
                        className="w-5 h-5"
                        style={{ color: "#558b2f" }}
                      />
                    </div>
                    <h3 className="text-gray-600 text-sm">Completed</h3>
                  </div>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {projects.filter((p) => p.status === "Completed").length}
                  </p>
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#001f54" }}>
                      <tr>
                        <th className="px-6 py-4 text-left text-white">
                          Project Name
                        </th>
                        <th className="px-6 py-4 text-left text-white">
                          Client
                        </th>
                        <th className="px-6 py-4 text-left text-white">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-white">
                          Assigned Staff
                        </th>
                        <th className="px-6 py-4 text-left text-white">
                          Start Date
                        </th>
                        <th className="px-6 py-4 text-left text-white">
                          Expected Completion
                        </th>
                        <th className="px-6 py-4 text-left text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No projects found matching your criteria
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((project) => (
                          <tr
                            key={project.id}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span
                                className="font-medium"
                                style={{ color: "#001f54" }}
                              >
                                {project.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {project.client}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: getStatusColor(
                                    project.status,
                                  ).bg,
                                  color: getStatusColor(project.status).text,
                                }}
                              >
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {project.assignedStaff.length === 0 ? (
                                <span className="text-gray-400 text-sm">
                                  Unassigned
                                </span>
                              ) : (
                                <div className="flex items-center gap-1">
                                  {project.assignedStaff
                                    .slice(0, 2)
                                    .map((staff, idx) => (
                                      <div
                                        key={idx}
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                                        style={{ backgroundColor: "#4169e1" }}
                                        title={staff}
                                      >
                                        {staff
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </div>
                                    ))}
                                  {project.assignedStaff.length > 2 && (
                                    <span className="text-xs text-gray-500 ml-1">
                                      +{project.assignedStaff.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {project.startDate}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {project.expectedCompletion}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedProject(project)}
                                  className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  title="View Details"
                                  style={{ color: "#4169e1" }}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {project.status === "Pending" && (
                                  <button
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setShowApproveDialog(true);
                                    }}
                                    className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                                    title="Approve Project"
                                    style={{ color: "#558b2f" }}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setShowAssignStaffDialog(true);
                                  }}
                                  className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
                                  title="Assign Staff"
                                  style={{ color: "#9c27b0" }}
                                >
                                  <Users className="w-4 h-4" />
                                </button>
                                <button
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Open Chats"
                                  style={{ color: "#717182" }}
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Approve Project Dialog */}
      {showApproveDialog && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#f1f8e9" }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: "#558b2f" }} />
              </div>
              <h2
                className="text-2xl text-center mb-2"
                style={{ color: "#001f54" }}
              >
                Approve Project
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to approve{" "}
                <span className="font-medium" style={{ color: "#001f54" }}>
                  {selectedProject.name}
                </span>
                ?
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                This will change the project status to "In Progress" and notify
                the team.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveDialog(false);
                  if (!selectedProject.assignedStaff.length) {
                    setSelectedProject(null);
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                onClick={handleApproveProject}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Project Dialog */}
      {showCompleteDialog && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#f1f8e9" }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: "#558b2f" }} />
              </div>
              <h2
                className="text-2xl text-center mb-2"
                style={{ color: "#001f54" }}
              >
                Mark Project as Completed
              </h2>
              <p className="text-center text-gray-600">
                Are you sure you want to mark{" "}
                <span className="font-medium" style={{ color: "#001f54" }}>
                  {selectedProject.name}
                </span>{" "}
                as completed?
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                This will finalize the project and notify all stakeholders.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteDialog(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#558b2f" }}
                onClick={handleCompleteProject}
              >
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Staff Dialog */}
      {showAssignStaffDialog && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl" style={{ color: "#001f54" }}>
                Assign Staff
              </h2>
              <button
                onClick={() => setShowAssignStaffDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#717182" }} />
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableStaff
                .filter(
                  (staff) => !selectedProject.assignedStaff.includes(staff),
                )
                .map((staff) => (
                  <button
                    key={staff}
                    onClick={() => {
                      handleAssignStaff(staff);
                      setShowAssignStaffDialog(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: "#4169e1" }}
                    >
                      {staff
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium" style={{ color: "#001f54" }}>
                      {staff}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Project Dialog */}
      {showCreateProjectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl" style={{ color: "#001f54" }}>
                Create New Project
              </h2>
              <button
                onClick={() => setShowCreateProjectDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#717182" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Project Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Client Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter project description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#001f54" }}
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#001f54" }}
                  >
                    Expected Completion
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Budget
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="$0"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateProjectDialog(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  style={{ color: "#001f54" }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#4169e1" }}
                  onClick={() => setShowCreateProjectDialog(false)}
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
