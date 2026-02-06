import { useEffect, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { getActivityLogs, getCompanyUsers } from "../../api/admin";
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
import { getUsers } from "../../api/admin";

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
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, [page, entityFilter, userFilter, dateRange]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatAction = (action: string) => {
    return action.charAt(0) + action.slice(1).toLowerCase();
  };

  const formatEntity = (entity: string) => {
    return entity.charAt(0) + entity.slice(1).toLowerCase();
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await getActivityLogs({
        page,
        limit: 20,
        entity: entityFilter !== "all" ? entityFilter.toUpperCase() : undefined,
        actorId: userFilter !== "all" ? userFilter : undefined,
      });

      setLogs(res.logs);
      setPagination(res.pagination);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getCompanyUsers();
      setUsers(res);

      console.log("Got users", res);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const mappedLogs = logs.map((log) => ({
    id: log.id,
    timestamp: new Date(log.createdAt).toLocaleString(),
    actor: `${log.actor.firstName} ${log.actor.lastName}`,
    actorRole: log.actor.role,
    action: formatAction(log.action),
    entity: formatEntity(log.entity),
    entityId: log.entityId,
    description: log.message || `${log.action} ${log.entity}`,
  }));

  // Filter logsd
  const filteredLogs = mappedLogs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === "all" || log.entity === entityFilter;
    const matchesUser = true;

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
    total: pagination?.total || 0,
    today: mappedLogs.filter((log) => {
      const today = new Date().toDateString();
      return new Date(log.timestamp).toDateString() === today;
    }).length,
    byEntity: {
      Project: mappedLogs.filter((l) => l.entity === "Project").length,
      Procurement: mappedLogs.filter((l) => l.entity === "Procurement").length,
      Document: mappedLogs.filter((l) => l.entity === "Document").length,
      User: mappedLogs.filter((l) => l.entity === "User").length,
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
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
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
                  Showing {filteredLogs.length} of {mappedLogs.length} total
                  logs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                    style={{ color: "#001f54" }}
                    onClick={() => {
                      if (page > 1) setPage(page - 1);
                    }}
                  >
                    Previous
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#4169e1" }}
                    onClick={() => {
                      if (page < pagination.totalPages) setPage(page + 1);
                    }}
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
