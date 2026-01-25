import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import {
  BarChart3,
  Clock,
  Info,
  RefreshCw,
  ChevronDown,
  Maximize2,
  Download,
  Share2,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
} from "lucide-react";

interface DashboardData {
  id: number;
  name: string;
  category: string;
  description: string;
  lastRefreshed: string;
  metrics: {
    label: string;
    value: string;
    icon: any;
    trend?: string;
  }[];
}

export default function ClientDashboardsPage() {
  const [selectedDashboard, setSelectedDashboard] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock dashboard data
  const dashboards: DashboardData[] = [
    {
      id: 1,
      name: "Project Performance Overview",
      category: "Overview",
      description:
        "Comprehensive view of all active projects including budget utilization, timeline adherence, and team performance metrics. Updated automatically every 6 hours.",
      lastRefreshed: "Jan 21, 2026 at 2:30 PM",
      metrics: [
        {
          label: "Active Projects",
          value: "8",
          icon: BarChart3,
          trend: "+2 this month",
        },
        {
          label: "Team Members",
          value: "24",
          icon: Users,
          trend: "+3 this quarter",
        },
        {
          label: "Budget Utilized",
          value: "67%",
          icon: DollarSign,
          trend: "On track",
        },
        {
          label: "Avg. Completion",
          value: "73%",
          icon: TrendingUp,
          trend: "+5% this week",
        },
      ],
    },
    {
      id: 2,
      name: "Financial Analytics",
      category: "Finance",
      description:
        "Real-time financial insights including project costs, invoicing status, payment timelines, and ROI tracking. Data is synchronized with your accounting system.",
      lastRefreshed: "Jan 21, 2026 at 1:45 PM",
      metrics: [
        { label: "Total Investment", value: "$485K", icon: DollarSign },
        { label: "Paid Invoices", value: "12", icon: TrendingUp },
        { label: "Pending Amount", value: "$125K", icon: Clock },
        { label: "ROI", value: "+18%", icon: BarChart3, trend: "Above target" },
      ],
    },
    {
      id: 3,
      name: "Timeline & Milestones",
      category: "Planning",
      description:
        "Track project timelines, milestone completion rates, and identify potential delays. Includes Gantt chart visualization and critical path analysis.",
      lastRefreshed: "Jan 21, 2026 at 3:00 PM",
      metrics: [
        { label: "Upcoming Milestones", value: "15", icon: Calendar },
        {
          label: "On Schedule",
          value: "85%",
          icon: TrendingUp,
          trend: "+3% improvement",
        },
        { label: "Avg. Delay", value: "2.4 days", icon: Clock },
        { label: "Critical Items", value: "3", icon: Info },
      ],
    },
    {
      id: 4,
      name: "Resource Utilization",
      category: "Resources",
      description:
        "Monitor team capacity, workload distribution, and resource allocation across projects. Helps identify bottlenecks and optimization opportunities.",
      lastRefreshed: "Jan 21, 2026 at 2:15 PM",
      metrics: [
        { label: "Team Capacity", value: "78%", icon: Users },
        { label: "Available Hours", value: "180", icon: Clock },
        { label: "Peak Utilization", value: "92%", icon: TrendingUp },
        { label: "Projects/Person", value: "2.3", icon: BarChart3 },
      ],
    },
    {
      id: 5,
      name: "Quality & Performance Metrics",
      category: "Quality",
      description:
        "Track deliverable quality, client satisfaction scores, revision requests, and overall project health indicators. Includes trend analysis and benchmarking.",
      lastRefreshed: "Jan 21, 2026 at 1:30 PM",
      metrics: [
        {
          label: "Satisfaction Score",
          value: "4.8/5",
          icon: TrendingUp,
          trend: "+0.2 this month",
        },
        { label: "First-time Approval", value: "82%", icon: BarChart3 },
        { label: "Avg. Revisions", value: "1.4", icon: RefreshCw },
        { label: "Quality Rating", value: "A+", icon: Info },
      ],
    },
  ];

  const currentDashboard =
    dashboards.find((d) => d.id === selectedDashboard) || dashboards[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="client" />
      <ClientSidebar activeItem="dashboards" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
              Analytics Dashboards
            </h1>
            <p className="text-gray-600">
              Real-time insights and performance metrics for your projects
            </p>
          </div>

          {/* Dashboard Selector & Actions */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Dashboard Selector */}
              <div className="w-full sm:w-auto sm:min-w-[320px]">
                <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  Select Dashboard
                </label>
                <div className="relative">
                  <BarChart3
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    value={selectedDashboard}
                    onChange={(e) =>
                      setSelectedDashboard(Number(e.target.value))
                    }
                    className="w-full pl-11 pr-10 py-3 border rounded-lg text-sm font-medium appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    style={
                      {
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4169e1",
                        color: "#001f54",
                      } as React.CSSProperties
                    }
                  >
                    {dashboards.map((dashboard) => (
                      <option key={dashboard.id} value={dashboard.id}>
                        {dashboard.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: "#e5e7eb", color: "#4169e1" }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: "#e5e7eb", color: "#4169e1" }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  <Maximize2 className="w-4 h-4" />
                  {isFullscreen ? "Exit" : "Fullscreen"}
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {currentDashboard.metrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#4169e120" }}
                  >
                    <metric.icon
                      className="w-5 h-5"
                      style={{ color: "#4169e1" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                <p
                  className="text-2xl font-bold mb-1"
                  style={{ color: "#001f54" }}
                >
                  {metric.value}
                </p>
                {metric.trend && (
                  <p className="text-xs" style={{ color: "#32cd32" }}>
                    {metric.trend}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Dashboard Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Dashboard Frame */}
                <div
                  className={`relative ${
                    isFullscreen ? "fixed inset-0 z-50" : "aspect-video"
                  } bg-gradient-to-br from-gray-50 to-gray-100 border-b`}
                  style={{ borderColor: "#e5e7eb" }}
                >
                  {/* PowerBI Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center max-w-md px-6">
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: "#4169e1" }}
                      >
                        <BarChart3 className="w-10 h-10 text-white" />
                      </div>
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: "#001f54" }}
                      >
                        {currentDashboard.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        PowerBI dashboard will be embedded here
                      </p>
                      <div
                        className="bg-white rounded-lg p-4 border"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <code className="text-xs text-gray-700 break-all">
                          &lt;iframe src="https://app.powerbi.com/..." /&gt;
                        </code>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Connect your PowerBI workspace to display live analytics
                      </p>
                    </div>
                  </div>

                  {/* Fullscreen Exit Button */}
                  {isFullscreen && (
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all"
                      style={{ backgroundColor: "#001f54", color: "white" }}
                    >
                      Exit Fullscreen
                    </button>
                  )}
                </div>

                {/* Dashboard Controls */}
                {!isFullscreen && (
                  <div
                    className="p-4 bg-gray-50 border-t"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Last refreshed: {currentDashboard.lastRefreshed}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-all"
                          style={{ color: "#4169e1" }}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Features Note */}
              {!isFullscreen && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#4169e1" }}
                    >
                      <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4
                        className="text-sm font-semibold mb-1"
                        style={{ color: "#001f54" }}
                      >
                        Interactive Analytics
                      </h4>
                      <p className="text-sm text-gray-600">
                        Click and drag to explore data, hover for details, and
                        use filters to customize your view. Dashboards update
                        automatically based on your project data.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Panel */}
            {!isFullscreen && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5" style={{ color: "#4169e1" }} />
                    <h2 className="font-semibold" style={{ color: "#001f54" }}>
                      Dashboard Info
                    </h2>
                  </div>

                  {/* Category */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Category
                    </p>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#4169e120", color: "#4169e1" }}
                    >
                      {currentDashboard.category}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentDashboard.description}
                    </p>
                  </div>

                  {/* Last Refreshed */}
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Last Refreshed
                      </p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#001f54" }}
                    >
                      {currentDashboard.lastRefreshed}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      Quick Actions
                    </p>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                      style={{ borderColor: "#e5e7eb", color: "#4169e1" }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh Data
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                      style={{ borderColor: "#e5e7eb", color: "#4169e1" }}
                    >
                      <Download className="w-4 h-4" />
                      Export to PDF
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                      style={{ borderColor: "#e5e7eb", color: "#4169e1" }}
                    >
                      <Share2 className="w-4 h-4" />
                      Share Dashboard
                    </button>
                  </div>

                  {/* Help Link */}
                  <div
                    className="mt-6 pt-6 border-t"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <button
                      className="text-sm font-medium hover:underline"
                      style={{ color: "#4169e1" }}
                    >
                      Learn more about analytics →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
