import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  Plus,
  X,
  Search,
  Filter,
  FolderKanban,
  MessageCircle,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  User,
  Building,
} from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  avatar?: string;
}

interface Project {
  id: number;
  name: string;
  clientName: string;
  status:
    | "Planning"
    | "In Progress"
    | "On Hold"
    | "Completed"
    | "Pending Approval";
  progress: number;
  assignedStaff: StaffMember[];
  createdDate: string;
  deadline: string;
}

export default function StaffProjectsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [clientFilter, setClientFilter] = useState("All Clients");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // New project form state
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectClient, setNewProjectClient] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newProjectDeadline, setNewProjectDeadline] = useState("");

  // Mock projects data
  const allProjects: Project[] = [
    {
      id: 1,
      name: "Website Redesign",
      clientName: "Acme Corporation",
      status: "In Progress",
      progress: 75,
      assignedStaff: [
        { id: 1, name: "Sarah Chen", role: "Designer" },
        { id: 2, name: "Mike Johnson", role: "Developer" },
        { id: 3, name: "Emily Davis", role: "Project Manager" },
      ],
      createdDate: "Dec 15, 2025",
      deadline: "Jan 31, 2026",
    },
    {
      id: 2,
      name: "Mobile App Development",
      clientName: "TechStart Inc",
      status: "In Progress",
      progress: 45,
      assignedStaff: [
        { id: 2, name: "Mike Johnson", role: "Developer" },
        { id: 4, name: "David Kim", role: "Developer" },
      ],
      createdDate: "Jan 5, 2026",
      deadline: "Feb 15, 2026",
    },
    {
      id: 3,
      name: "E-commerce Platform",
      clientName: "Retail Solutions",
      status: "On Hold",
      progress: 60,
      assignedStaff: [
        { id: 1, name: "Sarah Chen", role: "Designer" },
        { id: 5, name: "Jordan Lee", role: "Developer" },
      ],
      createdDate: "Nov 20, 2025",
      deadline: "Jan 25, 2026",
    },
    {
      id: 4,
      name: "Brand Identity Package",
      clientName: "Creative Studios",
      status: "Completed",
      progress: 100,
      assignedStaff: [
        { id: 1, name: "Sarah Chen", role: "Designer" },
        { id: 3, name: "Emily Davis", role: "Project Manager" },
      ],
      createdDate: "Nov 10, 2025",
      deadline: "Jan 20, 2026",
    },
    {
      id: 5,
      name: "CRM System Integration",
      clientName: "Enterprise Solutions",
      status: "Planning",
      progress: 15,
      assignedStaff: [
        { id: 4, name: "David Kim", role: "Developer" },
        { id: 3, name: "Emily Davis", role: "Project Manager" },
      ],
      createdDate: "Jan 10, 2026",
      deadline: "Feb 28, 2026",
    },
    {
      id: 6,
      name: "Marketing Website",
      clientName: "Marketing Pros",
      status: "Pending Approval",
      progress: 0,
      assignedStaff: [{ id: 2, name: "Mike Johnson", role: "Developer" }],
      createdDate: "Jan 18, 2026",
      deadline: "Feb 20, 2026",
    },
  ];

  const clients = [
    "All Clients",
    ...Array.from(new Set(allProjects.map((p) => p.clientName))),
  ];

  // Filter projects
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || project.status === statusFilter;
    const matchesClient =
      clientFilter === "All Clients" || project.clientName === clientFilter;
    return matchesSearch && matchesStatus && matchesClient;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Planning":
        return { backgroundColor: "#9333ea20", color: "#9333ea", icon: Clock };
      case "In Progress":
        return { backgroundColor: "#4169e120", color: "#4169e1", icon: Clock };
      case "On Hold":
        return {
          backgroundColor: "#ff980020",
          color: "#ff9800",
          icon: AlertCircle,
        };
      case "Completed":
        return {
          backgroundColor: "#32cd3220",
          color: "#32cd32",
          icon: CheckCircle,
        };
      case "Pending Approval":
        return { backgroundColor: "#ff980020", color: "#ff9800", icon: Clock };
      default:
        return { backgroundColor: "#71718220", color: "#717182", icon: Clock };
    }
  };

  const handleCreateProject = () => {
    console.log("Creating project:", {
      name: newProjectName,
      client: newProjectClient,
      description: newProjectDescription,
      deadline: newProjectDeadline,
    });
    // Reset form
    setNewProjectName("");
    setNewProjectClient("");
    setNewProjectDescription("");
    setNewProjectDeadline("");
    setShowCreateModal(false);
  };

  const handleOpenChat = (project: Project) => {
    setSelectedProject(project);
    setShowChatModal(true);
  };

  const handleSelectThread = (threadType: "main" | "staff") => {
    console.log(
      `Opening ${threadType} thread for project:`,
      selectedProject?.name,
    );
    setShowChatModal(false);
    // Navigate to chat page with thread type
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <StaffSidebar activeItem="projects" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
                  My Projects
                </h1>
                <p className="text-gray-600">
                  Manage projects you're assigned to
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                <Plus className="w-5 h-5" />
                Create Project
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects..."
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
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                  <option>Pending Approval</option>
                </select>
              </div>

              {/* Client Filter */}
              <div className="relative">
                <Building
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  {clients.map((client) => (
                    <option key={client}>{client}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggle & Results Count */}
            <div
              className="flex items-center justify-between mt-4 pt-4 border-t"
              style={{ borderColor: "#e5e7eb" }}
            >
              <p className="text-sm text-gray-600">
                Showing {filteredProjects.length} of {allProjects.length}{" "}
                projects
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Project Cards/List */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <FolderKanban
                  className="w-8 h-8"
                  style={{ color: "#4169e1" }}
                />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "#001f54" }}
              >
                No projects found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or create a new project.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                <Plus className="w-5 h-5" />
                Create New Project
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const statusStyle = getStatusStyle(project.status);
                const StatusIcon = statusStyle.icon;

                return (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* Card Header */}
                    <div
                      className="p-5 border-b"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3
                            className="font-semibold text-lg mb-1"
                            style={{ color: "#001f54" }}
                          >
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {project.clientName}
                          </p>
                        </div>
                        <span
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                          style={statusStyle}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {project.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Progress</span>
                          <span
                            className="font-medium"
                            style={{ color: "#4169e1" }}
                          >
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${project.progress}%`,
                              backgroundColor: "#4169e1",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      {/* Assigned Staff */}
                      <div className="mb-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                          Assigned Team
                        </p>
                        <div className="flex items-center gap-2">
                          {/* Staff Avatars */}
                          <div className="flex -space-x-2">
                            {project.assignedStaff
                              .slice(0, 3)
                              .map((staff, index) => (
                                <div
                                  key={staff.id}
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                  style={{
                                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                                    zIndex:
                                      project.assignedStaff.length - index,
                                  }}
                                  title={staff.name}
                                >
                                  {staff.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                              ))}
                            {project.assignedStaff.length > 3 && (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                                style={{
                                  backgroundColor: "#717182",
                                  color: "white",
                                }}
                              >
                                +{project.assignedStaff.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-600">
                            {project.assignedStaff.length} members
                          </span>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Due {project.deadline}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            console.log("Open project:", project.id)
                          }
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                          style={{ backgroundColor: "#4169e1", color: "white" }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open Project
                        </button>
                        <button
                          onClick={() => handleOpenChat(project)}
                          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all hover:bg-gray-50"
                          style={{ borderColor: "#4169e1", color: "#4169e1" }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y" style={{ borderColor: "#e5e7eb" }}>
                {filteredProjects.map((project) => {
                  const statusStyle = getStatusStyle(project.status);
                  const StatusIcon = statusStyle.icon;

                  return (
                    <div
                      key={project.id}
                      className="p-5 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        {/* Project Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="flex-1">
                              <h3
                                className="font-semibold text-lg mb-1"
                                style={{ color: "#001f54" }}
                              >
                                {project.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {project.clientName}
                              </p>
                            </div>
                            <span
                              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                              style={statusStyle}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              {project.status}
                            </span>
                          </div>

                          {/* Progress */}
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex-1 max-w-xs">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{
                                        width: `${project.progress}%`,
                                        backgroundColor: "#4169e1",
                                      }}
                                    />
                                  </div>
                                </div>
                                <span className="text-xs font-medium text-gray-600 w-10">
                                  {project.progress}%
                                </span>
                              </div>
                            </div>

                            {/* Staff Avatars */}
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {project.assignedStaff
                                  .slice(0, 4)
                                  .map((staff, index) => (
                                    <div
                                      key={staff.id}
                                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                                      style={{
                                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                                        zIndex:
                                          project.assignedStaff.length - index,
                                      }}
                                      title={staff.name}
                                    >
                                      {staff.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Deadline */}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {project.deadline}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              console.log("Open project:", project.id)
                            }
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                            style={{
                              backgroundColor: "#4169e1",
                              color: "white",
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open
                          </button>
                          <button
                            onClick={() => handleOpenChat(project)}
                            className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all hover:bg-gray-50"
                            style={{ borderColor: "#4169e1", color: "#4169e1" }}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Project Modal */}
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
                Create New Project
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
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> New projects require admin approval
                  before they become active. You'll be notified once your
                  project is approved.
                </p>
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter client name..."
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Deadline *
                </label>
                <input
                  type="date"
                  value={newProjectDeadline}
                  onChange={(e) => setNewProjectDeadline(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  placeholder="Describe the project scope, objectives, and key deliverables..."
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
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
                onClick={handleCreateProject}
                disabled={
                  !newProjectName ||
                  !newProjectClient ||
                  !newProjectDescription ||
                  !newProjectDeadline
                }
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Thread Selector Modal */}
      {showChatModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div>
                <h2
                  className="text-xl font-semibold mb-1"
                  style={{ color: "#001f54" }}
                >
                  Select Chat Thread
                </h2>
                <p className="text-sm text-gray-600">{selectedProject.name}</p>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-3">
              {/* Main Thread */}
              <button
                onClick={() => handleSelectThread("main")}
                className="w-full p-4 border-2 rounded-xl text-left hover:bg-gray-50 transition-all"
                style={{ borderColor: "#4169e1" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#4169e120" }}
                  >
                    <Users className="w-5 h-5" style={{ color: "#4169e1" }} />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold mb-1"
                      style={{ color: "#001f54" }}
                    >
                      Main Thread
                    </h3>
                    <p className="text-sm text-gray-600">
                      Client-facing communication. All project stakeholders can
                      view messages.
                    </p>
                  </div>
                </div>
              </button>

              {/* Staff Thread */}
              <button
                onClick={() => handleSelectThread("staff")}
                className="w-full p-4 border-2 rounded-xl text-left hover:bg-gray-50 transition-all"
                style={{ borderColor: "#32cd32" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#32cd3220" }}
                  >
                    <User className="w-5 h-5" style={{ color: "#32cd32" }} />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold mb-1"
                      style={{ color: "#001f54" }}
                    >
                      Staff Thread
                    </h3>
                    <p className="text-sm text-gray-600">
                      Internal staff communication. Private discussions not
                      visible to clients.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Modal Footer */}
            <div
              className="p-4 border-t text-center"
              style={{ borderColor: "#e5e7eb" }}
            >
              <p className="text-xs text-gray-500">
                Choose the appropriate thread based on your communication needs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
