import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Briefcase,
  Users,
  ClipboardCheck,
  ShoppingCart,
  CheckCircle,
  XCircle,
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

export default function AdminDashboard() {
  // Mock data for pending project approvals
  const pendingProjects = [
    {
      id: 1,
      name: "E-Commerce Platform Redesign",
      requestedBy: "Sarah Johnson",
      client: "TechCorp Inc.",
      dateSubmitted: "Jan 20, 2026",
      budget: "$45,000",
    },
    {
      id: 2,
      name: "Mobile App Development",
      requestedBy: "Mike Chen",
      client: "StartupXYZ",
      dateSubmitted: "Jan 21, 2026",
      budget: "$32,000",
    },
    {
      id: 3,
      name: "Cloud Migration Project",
      requestedBy: "Emily Rodriguez",
      client: "Enterprise Co.",
      dateSubmitted: "Jan 22, 2026",
      budget: "$78,000",
    },
  ];

  // Mock data for pending procurement approvals
  const pendingProcurement = [
    {
      id: 1,
      item: "AWS Cloud Credits",
      project: "Cloud Migration Project",
      requestedBy: "David Kim",
      dateSubmitted: "Jan 21, 2026",
      amount: "$5,200",
    },
    {
      id: 2,
      item: "Design Software Licenses",
      project: "E-Commerce Platform Redesign",
      requestedBy: "Sarah Johnson",
      dateSubmitted: "Jan 22, 2026",
      amount: "$1,800",
    },
    {
      id: 3,
      item: "Server Hardware",
      project: "Infrastructure Upgrade",
      requestedBy: "Lisa Anderson",
      dateSubmitted: "Jan 23, 2026",
      amount: "$12,500",
    },
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      user: "Admin",
      action: "Approved project: Website Redesign",
      time: "30 minutes ago",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      action: "Submitted new project proposal",
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Admin",
      action: "Rejected procurement request",
      time: "2 hours ago",
    },
    {
      id: 4,
      user: "Mike Chen",
      action: "Updated project milestone",
      time: "3 hours ago",
    },
    {
      id: 5,
      user: "Admin",
      action: "Approved procurement: Cloud Services",
      time: "4 hours ago",
    },
  ];

  // Mock data for project status breakdown
  const projectStatusData = [
    { name: "Pending", value: 8, color: "#ff9800" },
    { name: "In Progress", value: 24, color: "#4169e1" },
    { name: "Completed", value: 15, color: "#a7fc00" },
    { name: "On Hold", value: 3, color: "#717182" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="dashboard" />
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
                50
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#ff9800" }}
                  ></span>
                  8 Pending
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#4169e1" }}
                  ></span>
                  24 In Progress
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#a7fc00" }}
                  ></span>
                  15 Completed
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
              <p className="text-xs text-gray-500">Total value: $19,500</p>
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
                32
              </p>
              <p className="text-xs text-gray-500">5 new this month</p>
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
                            <span>Client: {project.client}</span>
                            <span>•</span>
                            <span>Requested by: {project.requestedBy}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {project.dateSubmitted}
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
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                            style={{
                              backgroundColor: "#a7fc00",
                              color: "#001f54",
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1"
                            style={{ color: "#001f54" }}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                            style={{ color: "#4169e1" }}
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
                            <span>Project: {item.project}</span>
                            <span>•</span>
                            <span>Requested by: {item.requestedBy}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.dateSubmitted}
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
                            className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
                            style={{
                              backgroundColor: "#a7fc00",
                              color: "#001f54",
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 transition-colors flex items-center gap-1"
                            style={{ color: "#001f54" }}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                          <button
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                            style={{ color: "#4169e1" }}
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
                        {activity.user
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
                            {activity.user}
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
                      fill="#8884d8"
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
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity text-left"
                    style={{ backgroundColor: "#4169e1" }}
                  >
                    View All Projects
                  </button>
                  <button
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity text-left"
                    style={{ backgroundColor: "#001f54" }}
                  >
                    Manage Users
                  </button>
                  <button
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-left"
                    style={{ color: "#001f54" }}
                  >
                    View Activity Logs
                  </button>
                  <button
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-left"
                    style={{ color: "#001f54" }}
                  >
                    Generate Reports
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
