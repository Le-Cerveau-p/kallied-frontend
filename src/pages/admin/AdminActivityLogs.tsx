import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Activity,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  FileText,
  Briefcase,
  ShoppingCart,
  Upload,
  Mail,
  Settings,
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";

interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  entity:
    | "Project"
    | "Procurement"
    | "Document"
    | "User"
    | "Invoice"
    | "Contract"
    | "Message"
    | "System";
  entityId: string;
  description: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

export default function AdminActivityLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entityFilter, setEntityFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [dateRange, setDateRange] = useState("last-7-days");

  // Mock activity log data
  const activityLogs: ActivityLog[] = [
    {
      id: "LOG-001",
      timestamp: "Jan 25, 2026 at 2:45 PM",
      actor: "Admin User",
      actorRole: "System Administrator",
      action: "Approved",
      entity: "Procurement",
      entityId: "PR-001",
      description:
        'Approved procurement request "AWS Cloud Credits & Infrastructure" for $5,200',
      ipAddress: "192.168.1.45",
    },
    {
      id: "LOG-002",
      timestamp: "Jan 25, 2026 at 2:30 PM",
      actor: "Sarah Johnson",
      actorRole: "Project Manager",
      action: "Created",
      entity: "Project",
      entityId: "PROJ-052",
      description:
        'Created new project "Mobile Banking App" with estimated budget of $85,000',
      ipAddress: "192.168.1.23",
    },
    {
      id: "LOG-003",
      timestamp: "Jan 25, 2026 at 2:15 PM",
      actor: "David Kim",
      actorRole: "DevOps Engineer",
      action: "Uploaded",
      entity: "Document",
      entityId: "DOC-234",
      description:
        'Uploaded "Infrastructure_Diagram_v2.pdf" to Cloud Migration Project',
      ipAddress: "192.168.1.67",
    },
    {
      id: "LOG-004",
      timestamp: "Jan 25, 2026 at 1:50 PM",
      actor: "Admin User",
      actorRole: "System Administrator",
      action: "Rejected",
      entity: "Procurement",
      entityId: "PR-005",
      description:
        'Rejected procurement request "Testing Tools & QA Software" - Budget constraints',
      ipAddress: "192.168.1.45",
    },
    {
      id: "LOG-005",
      timestamp: "Jan 25, 2026 at 1:30 PM",
      actor: "Emily Rodriguez",
      actorRole: "QA Manager",
      action: "Updated",
      entity: "Project",
      entityId: "PROJ-032",
      description: 'Updated project status from "In Progress" to "QA Review"',
      ipAddress: "192.168.1.89",
    },
    {
      id: "LOG-006",
      timestamp: "Jan 25, 2026 at 1:15 PM",
      actor: "Admin User",
      actorRole: "System Administrator",
      action: "Created",
      entity: "User",
      entityId: "USR-045",
      description:
        'Created new user account for "John Martinez" with role "Developer"',
      ipAddress: "192.168.1.45",
    },
    {
      id: "LOG-007",
      timestamp: "Jan 25, 2026 at 12:45 PM",
      actor: "Finance Team",
      actorRole: "Finance Manager",
      action: "Generated",
      entity: "Invoice",
      entityId: "INV-2026-006",
      description:
        'Generated invoice for "Mobile App Development" - Amount: $18,500',
      ipAddress: "192.168.1.101",
    },
    {
      id: "LOG-008",
      timestamp: "Jan 25, 2026 at 12:30 PM",
      actor: "Mike Chen",
      actorRole: "Developer",
      action: "Sent",
      entity: "Message",
      entityId: "MSG-789",
      description:
        "Sent message to client regarding project milestone completion",
      ipAddress: "192.168.1.56",
    },
    {
      id: "LOG-009",
      timestamp: "Jan 25, 2026 at 11:45 AM",
      actor: "Lisa Anderson",
      actorRole: "Infrastructure Manager",
      action: "Submitted",
      entity: "Procurement",
      entityId: "PR-003",
      description:
        'Submitted procurement request "Server Hardware Upgrade" for $12,500',
      ipAddress: "192.168.1.78",
    },
    {
      id: "LOG-010",
      timestamp: "Jan 25, 2026 at 11:20 AM",
      actor: "Admin User",
      actorRole: "System Administrator",
      action: "Updated",
      entity: "Contract",
      entityId: "CON-002",
      description:
        'Updated contract terms for "StartupXYZ" - Extended end date to May 31, 2026',
      ipAddress: "192.168.1.45",
    },
    {
      id: "LOG-011",
      timestamp: "Jan 25, 2026 at 10:50 AM",
      actor: "Sarah Johnson",
      actorRole: "Project Manager",
      action: "Deleted",
      entity: "Document",
      entityId: "DOC-198",
      description:
        'Deleted outdated document "old_requirements_v1.doc" from project files',
      ipAddress: "192.168.1.23",
    },
    {
      id: "LOG-012",
      timestamp: "Jan 25, 2026 at 10:15 AM",
      actor: "System",
      actorRole: "Automated Process",
      action: "Generated",
      entity: "System",
      entityId: "SYS-001",
      description:
        "Automated backup completed successfully - 24.5GB data backed up",
      ipAddress: "N/A",
    },
    {
      id: "LOG-013",
      timestamp: "Jan 25, 2026 at 9:45 AM",
      actor: "Admin User",
      actorRole: "System Administrator",
      action: "Deactivated",
      entity: "User",
      entityId: "USR-023",
      description:
        'Deactivated user account for "Robert Smith" - Employee departure',
      ipAddress: "192.168.1.45",
    },
    {
      id: "LOG-014",
      timestamp: "Jan 25, 2026 at 9:20 AM",
      actor: "David Kim",
      actorRole: "DevOps Engineer",
      action: "Updated",
      entity: "Project",
      entityId: "PROJ-045",
      description:
        'Updated project milestone "Phase 2 - Data Migration" to completed',
      ipAddress: "192.168.1.67",
    },
    {
      id: "LOG-015",
      timestamp: "Jan 25, 2026 at 8:50 AM",
      actor: "Emily Rodriguez",
      actorRole: "QA Manager",
      action: "Created",
      entity: "Document",
      entityId: "DOC-235",
      description:
        'Created test report "QA_Testing_Results_Sprint_5.pdf" for E-Commerce project',
      ipAddress: "192.168.1.89",
    },
    {
      id: "LOG-016",
      timestamp: "Jan 24, 2026 at 5:30 PM",
      actor: "Mike Chen",
      actorRole: "Developer",
      action: "Updated",
      entity: "Project",
      entityId: "PROJ-038",
      description: "Updated project progress to 75% completion",
      ipAddress: "192.168.1.56",
    },
    {
      id: "LOG-017",
      timestamp: "Jan 24, 2026 at 4:45 PM",
      actor: "Finance Team",
      actorRole: "Finance Manager",
      action: "Marked Paid",
      entity: "Invoice",
      entityId: "INV-2026-001",
      description:
        "Marked invoice INV-2026-001 as paid - Payment received: $25,000",
      ipAddress: "192.168.1.101",
    },
    {
      id: "LOG-018",
      timestamp: "Jan 24, 2026 at 3:20 PM",
      actor: "Admin User",
      actorRole: "System Administrator",
      action: "Updated",
      entity: "System",
      entityId: "SET-001",
      description:
        "Updated system notification settings - Email notifications enabled for all users",
      ipAddress: "192.168.1.45",
    },
    {
      id: "LOG-019",
      timestamp: "Jan 24, 2026 at 2:15 PM",
      actor: "Sarah Johnson",
      actorRole: "Project Manager",
      action: "Assigned",
      entity: "Project",
      entityId: "PROJ-051",
      description:
        'Assigned "Infrastructure Upgrade" project to team member David Kim',
      ipAddress: "192.168.1.23",
    },
    {
      id: "LOG-020",
      timestamp: "Jan 24, 2026 at 1:30 PM",
      actor: "Lisa Anderson",
      actorRole: "Infrastructure Manager",
      action: "Downloaded",
      entity: "Document",
      entityId: "DOC-220",
      description:
        'Downloaded "Server_Configuration_Guide.pdf" from resources library',
      ipAddress: "192.168.1.78",
    },
  ];

  // Get unique users for filter
  const uniqueUsers = Array.from(
    new Set(activityLogs.map((log) => log.actor)),
  ).sort();

  // Filter logs
  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === "all" || log.entity === entityFilter;
    const matchesUser = userFilter === "all" || log.actor === userFilter;

    return matchesSearch && matchesEntity && matchesUser;
  });

  // Get action icon and color
  const getActionIcon = (action: string) => {
    const actionMap: Record<
      string,
      { icon: React.ElementType; color: string }
    > = {
      Created: { icon: FileText, color: "text-blue-600" },
      Updated: { icon: Edit, color: "text-orange-600" },
      Deleted: { icon: Trash2, color: "text-red-600" },
      Approved: { icon: CheckCircle, color: "text-green-600" },
      Rejected: { icon: XCircle, color: "text-red-600" },
      Uploaded: { icon: Upload, color: "text-purple-600" },
      Downloaded: { icon: Download, color: "text-indigo-600" },
      Sent: { icon: Mail, color: "text-blue-600" },
      Generated: { icon: FileText, color: "text-teal-600" },
      Submitted: { icon: CheckCircle, color: "text-green-600" },
      Deactivated: { icon: UserMinus, color: "text-red-600" },
      Assigned: { icon: UserPlus, color: "text-green-600" },
      "Marked Paid": { icon: CheckCircle, color: "text-green-600" },
    };

    return actionMap[action] || { icon: Activity, color: "text-gray-600" };
  };

  // Get entity icon
  const getEntityIcon = (entity: string) => {
    const entityMap: Record<string, React.ElementType> = {
      Project: Briefcase,
      Procurement: ShoppingCart,
      Document: FileText,
      User: User,
      Invoice: FileText,
      Contract: FileText,
      Message: Mail,
      System: Settings,
    };

    return entityMap[entity] || Activity;
  };

  // Stats
  const stats = {
    total: activityLogs.length,
    today: activityLogs.filter((log) => log.timestamp.includes("Jan 25, 2026"))
      .length,
    byEntity: {
      Project: activityLogs.filter((log) => log.entity === "Project").length,
      Procurement: activityLogs.filter((log) => log.entity === "Procurement")
        .length,
      Document: activityLogs.filter((log) => log.entity === "Document").length,
      User: activityLogs.filter((log) => log.entity === "User").length,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="logs" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-4xl" style={{ color: "#001f54" }}>
                    Activity Logs
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Track all system actions and user activities
                  </p>
                </div>
              </div>

              <button
                className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
                style={{ backgroundColor: "#4169e1" }}
              >
                <Download className="w-4 h-4" />
                Export Logs
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Activity className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Total Activities</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">Last 7 days</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <Calendar className="w-6 h-6" style={{ color: "#a7fc00" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Today's Activities</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {stats.today}
              </p>
              <p className="text-xs text-gray-500">Jan 25, 2026</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Briefcase className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Project Actions</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {stats.byEntity.Project}
              </p>
              <p className="text-xs text-gray-500">All project-related</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Document Actions</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {stats.byEntity.Document}
              </p>
              <p className="text-xs text-gray-500">Uploads & downloads</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#001f54" }}
                >
                  Search Logs
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by actor, action, entity, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#001f54" }}
                >
                  Date Range
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="today">Today</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-90-days">Last 90 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Entity Type */}
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#001f54" }}
                >
                  Entity Type
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={entityFilter}
                    onChange={(e) => setEntityFilter(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="all">All Entities</option>
                    <option value="Project">Projects</option>
                    <option value="Procurement">Procurement</option>
                    <option value="Document">Documents</option>
                    <option value="User">Users</option>
                    <option value="Invoice">Invoices</option>
                    <option value="Contract">Contracts</option>
                    <option value="Message">Messages</option>
                    <option value="System">System</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* User Filter - Second Row */}
            <div className="mt-4">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#001f54" }}
              >
                Filter by User
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-full sm:w-96 pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Users</option>
                  {uniqueUsers.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute left-[22rem] sm:left-[22rem] top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Activity Logs Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl" style={{ color: "#001f54" }}>
                Activity Logs ({filteredLogs.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Timestamp
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Actor
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Action
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Entity
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Description
                    </th>
                    <th className="text-center py-4 px-6 font-medium text-gray-700">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-500"
                      >
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No activity logs found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const { icon: ActionIcon, color: actionColor } =
                        getActionIcon(log.action);
                      const EntityIcon = getEntityIcon(log.entity);

                      return (
                        <tr
                          key={log.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {log.timestamp}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <User className="w-4 h-4 text-gray-400" />
                                <span
                                  className="font-medium text-sm"
                                  style={{ color: "#001f54" }}
                                >
                                  {log.actor}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {log.actorRole}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <ActionIcon
                                className={`w-4 h-4 ${actionColor}`}
                              />
                              <span
                                className={`text-sm font-medium ${actionColor}`}
                              >
                                {log.action}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <EntityIcon className="w-4 h-4 text-gray-400" />
                              <div>
                                <span className="text-sm font-medium text-gray-700">
                                  {log.entity}
                                </span>
                                <div className="text-xs text-gray-500 font-mono">
                                  {log.entityId}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {log.description}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors inline-flex"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredLogs.length > 0 && (
              <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredLogs.length} of {activityLogs.length} total
                  logs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{ color: "#001f54" }}
                  >
                    Previous
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#4169e1" }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
