import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  FolderKanban,
  ChevronDown,
  RefreshCw,
  Database,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface Dashboard {
  id: number;
  name: string;
  projectId: number;
  projectName: string;
  embedUrl: string;
  lastUpdated: string;
  dataSource: string;
  description?: string;
}

export default function StaffDashboardsPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(1);

  // Mock projects data
  const projects = [
    { id: 1, name: "Website Redesign", client: "Acme Corporation" },
    { id: 2, name: "Mobile App Development", client: "TechStart Inc" },
    { id: 3, name: "E-commerce Platform", client: "Retail Solutions" },
    { id: 4, name: "Brand Identity Package", client: "Creative Studios" },
    { id: 5, name: "CRM System Integration", client: "Enterprise Solutions" },
  ];

  // Mock dashboards data
  const allDashboards: Dashboard[] = [
    {
      id: 1,
      name: "Website Analytics Dashboard",
      projectId: 1,
      projectName: "Website Redesign",
      embedUrl: "https://app.powerbi.com/view?r=sample1",
      lastUpdated: "Jan 23, 2026 at 8:30 AM",
      dataSource: "Google Analytics, Adobe Analytics",
      description:
        "Comprehensive website performance metrics including traffic, conversions, and user behavior",
    },
    {
      id: 2,
      name: "User Engagement Dashboard",
      projectId: 1,
      projectName: "Website Redesign",
      embedUrl: "https://app.powerbi.com/view?r=sample2",
      lastUpdated: "Jan 23, 2026 at 6:15 AM",
      dataSource: "Firebase Analytics, Mixpanel",
      description:
        "User engagement metrics, session duration, and feature adoption rates",
    },
    {
      id: 3,
      name: "App Performance Dashboard",
      projectId: 2,
      projectName: "Mobile App Development",
      embedUrl: "https://app.powerbi.com/view?r=sample3",
      lastUpdated: "Jan 22, 2026 at 11:45 PM",
      dataSource: "Firebase Performance, Crashlytics",
      description:
        "Mobile app performance metrics, crash reports, and API response times",
    },
    {
      id: 4,
      name: "Sales Analytics Dashboard",
      projectId: 3,
      projectName: "E-commerce Platform",
      embedUrl: "https://app.powerbi.com/view?r=sample4",
      lastUpdated: "Jan 23, 2026 at 7:00 AM",
      dataSource: "Shopify, Stripe, Google Analytics",
      description:
        "E-commerce sales data, revenue trends, and customer acquisition metrics",
    },
  ];

  // Filter dashboards by selected project
  const filteredDashboards = selectedProject
    ? allDashboards.filter((d) => d.projectId === selectedProject)
    : allDashboards;

  const selectedProjectData = projects.find((p) => p.id === selectedProject);
  const activeDashboard = filteredDashboards[0]; // Default to first dashboard

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <StaffSidebar activeItem="powerbi" />

      <main className="pt-20 lg:pl-64">
        {/* Minimal Header */}
        <div className="bg-white border-b" style={{ borderColor: "#e5e7eb" }}>
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Project Selector */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FolderKanban
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <select
                    value={selectedProject || ""}
                    onChange={(e) =>
                      setSelectedProject(Number(e.target.value) || null)
                    }
                    className="w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    style={
                      {
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4169e1",
                        color: "#001f54",
                      } as React.CSSProperties
                    }
                  >
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>

              {/* Dashboard Tabs (if multiple dashboards) */}
              {filteredDashboards.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  {filteredDashboards.map((dashboard) => (
                    <button
                      key={dashboard.id}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-all whitespace-nowrap ${
                        dashboard.id === activeDashboard?.id
                          ? "text-white"
                          : "border hover:bg-gray-50"
                      }`}
                      style={
                        dashboard.id === activeDashboard?.id
                          ? { backgroundColor: "#4169e1" }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {dashboard.name.replace(" Dashboard", "")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeDashboard ? (
          <div className="h-[calc(100vh-140px)]">
            {/* Dashboard Metadata Bar */}
            <div
              className="bg-white border-b px-4 sm:px-6 lg:px-8 py-3"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Last updated:{" "}
                      <span className="font-medium text-gray-900">
                        {activeDashboard.lastUpdated}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Data source:{" "}
                      <span className="font-medium text-gray-900">
                        {activeDashboard.dataSource}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Refresh dashboard"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Embedded Dashboard */}
            <div className="h-full bg-white">
              {/* Placeholder for PowerBI iframe */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center max-w-2xl px-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: "#4169e120" }}
                  >
                    <Database
                      className="w-10 h-10"
                      style={{ color: "#4169e1" }}
                    />
                  </div>
                  <h3
                    className="text-2xl font-semibold mb-3"
                    style={{ color: "#001f54" }}
                  >
                    {activeDashboard.name}
                  </h3>
                  {activeDashboard.description && (
                    <p className="text-gray-600 mb-6">
                      {activeDashboard.description}
                    </p>
                  )}
                  <div className="p-4 bg-blue-100 rounded-lg border border-blue-200 text-sm text-left">
                    <p className="font-medium text-gray-900 mb-2">
                      PowerBI Integration Note:
                    </p>
                    <p className="text-gray-700 mb-2">
                      In production, this area would display an embedded PowerBI
                      dashboard using an iframe:
                    </p>
                    <code
                      className="block bg-white p-3 rounded border border-blue-200 text-xs font-mono overflow-x-auto"
                      style={{ color: "#001f54" }}
                    >
                      &lt;iframe
                      <br />
                      &nbsp;&nbsp;src="{activeDashboard.embedUrl}"
                      <br />
                      &nbsp;&nbsp;width="100%"
                      <br />
                      &nbsp;&nbsp;height="100%"
                      <br />
                      &nbsp;&nbsp;frameBorder="0"
                      <br />
                      &nbsp;&nbsp;allowFullScreen
                      <br />
                      /&gt;
                    </code>
                  </div>
                </div>
              </div>

              {/* Actual iframe would be used in production:
              <iframe
                src={activeDashboard.embedUrl}
                className="w-full h-full border-0"
                title={activeDashboard.name}
                allowFullScreen
              />
              */}
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-white">
            <div className="text-center max-w-md px-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <Database className="w-8 h-8" style={{ color: "#4169e1" }} />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "#001f54" }}
              >
                No dashboards available
              </h3>
              <p className="text-gray-600">
                {selectedProjectData
                  ? `No dashboards have been configured for ${selectedProjectData.name}`
                  : "Select a project to view its dashboards"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
