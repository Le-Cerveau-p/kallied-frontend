import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSocket } from "../../socket/adminSocket";
import {
  getAdminDashboard,
  getPendingProjects,
  getPendingProcurements,
  getAdminCharts,
} from "../../api/admin";
import {
  Briefcase,
  Users,
  ClipboardCheck,
  ShoppingCart,
  Eye,
  Activity,
  Clock,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { getCurrentUser } from "../../api/users";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  useEffect(() => {
    setLoading(true);
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();

    setLoading(false);
  }, []);
  const [stats, setStats] = useState<any>(null);
  const [pendingProjects, setPendingProjects] = useState<any[]>([]);
  const [pendingProcurement, setPendingProcurement] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [projectStatusData, setProjectStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "#22c55e",
    COMPLETED: "#3b82f6",
    ON_HOLD: "#f59e0b",
    CANCELLED: "#ef4444",
  };

  useEffect(() => {
    async function loadDashboard() {
      const dashboard = await getAdminDashboard();
      const projects = await getPendingProjects();
      const procurements = await getPendingProcurements();

      setStats(dashboard.stats);
      setRecentActivity(dashboard.recentActivity);
      setPendingProjects(projects);
      setPendingProcurement(procurements);
    }

    loadDashboard();
  }, []);

  useEffect(() => {
    adminSocket.on("project-approved", () => {
      getAdminDashboard().then((d) => setStats(d.stats));
    });

    adminSocket.on("procurement-submitted", () => {
      getPendingProcurements().then(setPendingProcurement);
    });

    return () => {
      adminSocket.off("project-approved");
      adminSocket.off("procurement-submitted");
    };
  }, []);

  useEffect(() => {
    getAdminCharts().then((data) => {
      const formatted = data.projectsByStatus.map((item: any) => ({
        name: item.status,
        value: item._count._all,
        color: STATUS_COLORS[item.status] || "#8884d8",
      }));

      setProjectStatusData(formatted);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage="dashboard"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <AdminSidebar activeItem="dashboard" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: "#001f54" }}>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Manage approvals and monitor company activity
            </p>
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Projects */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <Briefcase className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Total Projects</h3>
              <p className="text-3xl mb-3" style={{ color: "#001f54" }}>
                {stats?.totalProjects}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#ff9800" }}
                  ></span>
                  {stats?.pendingProjects} Pending
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#4169e1" }}
                  ></span>
                  {stats?.inProgressProjects} In Progress
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#a7fc00" }}
                  ></span>
                  {stats?.completedProjects} Completed
                </span>
              </div>
            </div>

            {/* Pending Project Approvals */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#fff3e0" }}
                >
                  <ClipboardCheck
                    className="w-6 h-6"
                    style={{ color: "#ff9800" }}
                  />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">
                Pending Project Approvals
              </h3>
              <p className="text-3xl mb-3" style={{ color: "#001f54" }}>
                {pendingProjects.length}
              </p>
              <p className="text-xs text-gray-500">Requires your attention</p>
            </div>

            {/* Pending Procurement Approvals */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#fce4ec" }}
                >
                  <ShoppingCart
                    className="w-6 h-6"
                    style={{ color: "#d4183d" }}
                  />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">
                Pending Procurement Approvals
              </h3>
              <p className="text-3xl mb-3" style={{ color: "#001f54" }}>
                {pendingProcurement.length}
              </p>
              <p className="text-xs text-gray-500">
                Total value: ₦{stats?.procurementValue}
              </p>
            </div>

            {/* Active Clients */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <Users className="w-6 h-6" style={{ color: "#a7fc00" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Active Clients</h3>
              <p className="text-3xl mb-3" style={{ color: "#001f54" }}>
                {stats?.activeClients}
              </p>
              <p className="text-xs text-gray-500">
                {stats?.newClientsThisMonth} new this month
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Wider (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Approval Queue - Projects */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl" style={{ color: "#001f54" }}>
                    Pending Project Approvals
                  </h2>
                  <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                    {pendingProjects.length} pending
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4
                            className="font-medium mb-1"
                            style={{ color: "#001f54" }}
                          >
                            {project.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span>Client: {project.client.name}</span>
                            <span>•</span>
                            <span>Requested by: {project.createdBy?.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {project.createdAt}
                            </span>
                          </div>
                          <p
                            className="text-sm mt-2"
                            style={{ color: "#4169e1" }}
                          >
                            Budget: {project.budget}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                            style={{ color: "#4169e1" }}
                            onClick={() => navigate("/admin/projects")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Queue - Procurement */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl" style={{ color: "#001f54" }}>
                    Pending Procurement Approvals
                  </h2>
                  <span className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-700">
                    {pendingProcurement.length} pending
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingProcurement.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4
                            className="font-medium mb-1"
                            style={{ color: "#001f54" }}
                          >
                            {item.item}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span>Project: {item.project.name}</span>
                            <span>•</span>
                            <span>Requested by: {item.createdBy.name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.createdAt}
                            </span>
                          </div>
                          <p
                            className="text-sm mt-2 font-medium"
                            style={{ color: "#d4183d" }}
                          >
                            Amount: {item.amount}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                            style={{ color: "#4169e1" }}
                            onClick={() => navigate("/admin/procurements")}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "#f3e5f5" }}
                    >
                      <Activity
                        className="w-5 h-5"
                        style={{ color: "#9c27b0" }}
                      />
                    </div>
                    <h2 className="text-xl" style={{ color: "#001f54" }}>
                      Recent Activity
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/admin/logs")}
                    className="text-sm hover:underline"
                    style={{ color: "#4169e1" }}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: "#4169e1" }}
                      >
                        {activity.actor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span
                            className="font-medium"
                            style={{ color: "#001f54" }}
                          >
                            {activity.actor.name}
                          </span>{" "}
                          <span className="text-gray-600">
                            {activity.action}
                          </span>
                        </p>
                        <span className="text-xs text-gray-400">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-6">
              {/* Project Status Breakdown */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-6" style={{ color: "#001f54" }}>
                  Project Status Breakdown
                </h2>
                {projectStatusData.length === 0 && (
                  <p className="text-sm text-gray-500 text-center mt-12">
                    No project data available
                  </p>
                )}
                {projectStatusData.length > 0 && (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={projectStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        // fill="#8884d8"
                        dataKey="value"
                      >
                        {projectStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="mt-6 space-y-3">
                  {projectStatusData.map((status) => (
                    <div
                      key={status.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: status.color }}
                        ></div>
                        <span className="text-sm text-gray-700">
                          {status.name}
                        </span>
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#001f54" }}
                      >
                        {status.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4" style={{ color: "#001f54" }}>
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/admin/projects")}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity text-left"
                    style={{ backgroundColor: "#4169e1" }}
                  >
                    View All Projects
                  </button>
                  <button
                    onClick={() => navigate("/admin/users")}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity text-left"
                    style={{ backgroundColor: "#001f54" }}
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => navigate("/admin/logs")}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-left"
                    style={{ color: "#001f54" }}
                  >
                    View Activity Logs
                  </button>
                  <button
                    onClick={() => navigate("/admin/analytics")}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-left"
                    style={{ color: "#001f54" }}
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
