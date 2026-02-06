import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  Download,
  Filter,
  ChevronDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard, getAdminCharts } from "../../api/admin";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("last-6-months");
  const [selectedProject, setSelectedProject] = useState("all");

  const [dashboard, setDashboard] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [dashboardRes, chartsRes] = await Promise.all([
          getAdminDashboard(),
          getAdminCharts(),
        ]);

        setDashboard(dashboardRes);
        setCharts(chartsRes);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  // Mock data for KPIs

  // Project completion trends data
  const completionTrendsData = useMemo(() => {
    if (!charts?.projectsOverTime) return [];

    return charts.projectsOverTime.map((p: any) => ({
      month: p.month,
      completed: p.count,
      started: 0, // backend doesn’t track yet
    }));
  }, [charts]);

  // Procurement spend by project
  const procurementSpendData = useMemo(() => {
    if (!dashboard?.stats?.procurementByProject) return [];
    return dashboard.stats.procurementByProject;
  }, [dashboard]);

  // Project status distribution
  const projectStatusData = useMemo(() => {
    if (!charts?.projectsByStatus) return [];

    return charts.projectsByStatus.map((s: any) => ({
      name: s.status.replace("_", " "),
      value: s._count._all,
      color:
        s.status === "COMPLETED"
          ? "#a7fc00"
          : s.status === "IN_PROGRESS"
            ? "#4169e1"
            : s.status === "PENDING"
              ? "#ff9800"
              : "#9c27b0",
    }));
  }, [charts]);

  // Revenue by client type
  const revenueByClientData = [
    { type: "Enterprise", value: 1200000, color: "#4169e1" },
    { type: "Mid-Market", value: 800000, color: "#a7fc00" },
    { type: "Small Business", value: 450000, color: "#ff9800" },
  ];

  // Team utilization data
  const teamUtilizationData = [
    { month: "Aug", utilization: 78 },
    { month: "Sep", utilization: 82 },
    { month: "Oct", utilization: 75 },
    { month: "Nov", utilization: 88 },
    { month: "Dec", utilization: 85 },
    { month: "Jan", utilization: 80 },
  ];

  // Monthly revenue trend
  const monthlyRevenueData = [
    { month: "Aug", revenue: 380000, target: 400000 },
    { month: "Sep", revenue: 420000, target: 400000 },
    { month: "Oct", revenue: 390000, target: 400000 },
    { month: "Nov", revenue: 450000, target: 450000 },
    { month: "Dec", revenue: 480000, target: 450000 },
    { month: "Jan", revenue: 330000, target: 450000 },
  ];

  // Project categories performance
  const categoryPerformanceData = [
    { category: "Development", projects: 15, revenue: 890000, avgDuration: 72 },
    { category: "Design", projects: 8, revenue: 320000, avgDuration: 45 },
    {
      category: "Infrastructure",
      projects: 6,
      revenue: 540000,
      avgDuration: 85,
    },
    { category: "Consulting", projects: 12, revenue: 480000, avgDuration: 38 },
    { category: "Support", projects: 6, revenue: 220000, avgDuration: 60 },
  ];

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Get change indicator
  const getChangeIndicator = (change: number) => {
    const isPositive = change > 0;
    return (
      <span
        className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
      >
        {isPositive ? "↑" : "↓"} {Math.abs(change)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar />
        <AdminSidebar activeItem="analytics" />
        <main className="pt-24 px-6">Loading analytics…</main>
      </div>
    );
  }

  if (!dashboard || !charts) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="analytics" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <TrendingUp
                    className="w-8 h-8"
                    style={{ color: "#4169e1" }}
                  />
                </div>
                <div>
                  <h1 className="text-4xl" style={{ color: "#001f54" }}>
                    Analytics & Insights
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Company-wide performance metrics and trends
                  </p>
                </div>
              </div>

              {/* Export Button */}
              <button
                className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
                style={{ backgroundColor: "#4169e1" }}
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date Range Filter */}
              <div className="flex-1">
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
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="last-3-months">Last 3 Months</option>
                    <option value="last-6-months">Last 6 Months</option>
                    <option value="last-year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Project Filter */}
              <div className="flex-1">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#001f54" }}
                >
                  Project Filter
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="all">All Projects</option>
                    <option value="development">Development Projects</option>
                    <option value="design">Design Projects</option>
                    <option value="infrastructure">
                      Infrastructure Projects
                    </option>
                    <option value="consulting">Consulting Projects</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <DollarSign
                    className="w-6 h-6"
                    style={{ color: "#a7fc00" }}
                  />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Revenue</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {formatCurrency(dashboard.stats.procurementValue)}
              </p>
            </div>

            {/* Completed Projects */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <Briefcase className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Completed Projects</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {dashboard.stats.completedProjects}
              </p>
              <p className="text-xs text-gray-500"></p>
            </div>

            {/* Active Projects */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Briefcase className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Active Projects</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {dashboard.stats.inProgressProjects}
              </p>
              <p className="text-xs text-gray-500"></p>
            </div>

            {/* Average Project Duration */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">
                Avg Project Duration
              </h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                <span className="text-gray-400 text-sm">-</span>
                <span className="text-lg ml-1">Coming soon</span>
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Project Completion Trends */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-6" style={{ color: "#001f54" }}>
                Project Completion Trends
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={completionTrendsData}>
                  <defs>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#a7fc00" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#a7fc00"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorStarted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4169e1" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#4169e1"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#a7fc00"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Completed Projects"
                  />
                  <Area
                    type="monotone"
                    dataKey="started"
                    stroke="#4169e1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorStarted)"
                    name="Started Projects"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Revenue vs Target */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-6" style={{ color: "#001f54" }}>
                Monthly Revenue vs Target
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                {/* {charts?.projectsOverTime?.length ? (
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar
                      dataKey="revenue"
                      fill="#4169e1"
                      name="Actual Revenue"
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey="target"
                      fill="#e0e0e0"
                      name="Target Revenue"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <p className="text-sm text-gray-400">
                    No revenue data available
                  </p>
                )} */}
                <p className="text-sm text-gray-400">
                  Revenue trend data coming soon
                </p>
              </ResponsiveContainer>
            </div>

            {/* Procurement Spend by Project */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-6" style={{ color: "#001f54" }}>
                Procurement Spend by Project
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={procurementSpendData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <YAxis
                    dataKey="project"
                    type="category"
                    tick={{ fontSize: 11 }}
                    stroke="#666"
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#d4183d"
                    name="Procurement Spend"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Project Status Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl mb-6" style={{ color: "#001f54" }}>
                Project Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
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
              <div className="mt-4 grid grid-cols-2 gap-3">
                {projectStatusData.map((status) => (
                  <div key={status.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{status.name}</span>
                    <span
                      className="text-sm font-medium ml-auto"
                      style={{ color: "#001f54" }}
                    >
                      {status.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Categories Performance Table */}
          {/* <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl" style={{ color: "#001f54" }}>
                Project Categories Performance
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-medium text-gray-700">
                      Category
                    </th>
                    <th className="text-center py-4 px-6 font-medium text-gray-700">
                      Projects
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">
                      Revenue
                    </th>
                    <th className="text-center py-4 px-6 font-medium text-gray-700">
                      Avg Duration (days)
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-700">
                      Avg Revenue/Project
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryPerformanceData.map((category, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span
                          className="font-medium"
                          style={{ color: "#001f54" }}
                        >
                          {category.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-700">
                        {category.projects}
                      </td>
                      <td
                        className="py-4 px-6 text-right font-medium"
                        style={{ color: "#4169e1" }}
                      >
                        {formatCurrency(category.revenue)}
                      </td>
                      <td className="py-4 px-6 text-center text-gray-700">
                        {category.avgDuration}
                      </td>
                      <td className="py-4 px-6 text-right text-gray-700">
                        {formatCurrency(
                          Math.round(category.revenue / category.projects),
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-4 px-6" style={{ color: "#001f54" }}>
                      Total
                    </td>
                    <td
                      className="py-4 px-6 text-center"
                      style={{ color: "#001f54" }}
                    >
                      {categoryPerformanceData.reduce(
                        (sum, cat) => sum + cat.projects,
                        0,
                      )}
                    </td>
                    <td
                      className="py-4 px-6 text-right"
                      style={{ color: "#4169e1" }}
                    >
                      {formatCurrency(
                        categoryPerformanceData.reduce(
                          (sum, cat) => sum + cat.revenue,
                          0,
                        ),
                      )}
                    </td>
                    <td
                      className="py-4 px-6 text-center"
                      style={{ color: "#001f54" }}
                    >
                      {Math.round(
                        categoryPerformanceData.reduce(
                          (sum, cat) => sum + cat.avgDuration,
                          0,
                        ) / categoryPerformanceData.length,
                      )}
                    </td>
                    <td className="py-4 px-6"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
}
