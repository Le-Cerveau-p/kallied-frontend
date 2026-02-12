import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import { useEffect, useMemo, useState } from "react";
import {
  FolderKanban,
  CircleCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  FileText,
  Bell,
} from "lucide-react";
import { getClientDashboard } from "../../api/client";
import { getCurrentUser } from "../../api/users";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ClientDashboard() {
  type DashboardActivityType = "notification" | "update" | "document";

  interface SummaryStats {
    totalActiveProjects: number;
    projectsInProgress: number;
    completedProjects: number;
    pendingActions: number;
  }

  interface ActiveProject {
    id: string;
    name: string;
    status: string;
    progress: number;
    milestone: string;
    lastUpdate: string | Date;
    statusColor: string;
  }

  interface ActivityItem {
    id: string;
    type: DashboardActivityType;
    title: string;
    description: string;
    timestamp: string | Date;
    unread?: boolean;
  }

  interface DashboardData {
    summaryStats: SummaryStats;
    activeProjects: ActiveProject[];
    recentActivities: ActivityItem[];
  }

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      const data = await getClientDashboard();
      if (isMounted) {
        setDashboard(data);
      }
    }
    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setUserData(user);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const summaryStats: SummaryStats = dashboard?.summaryStats ?? {
    totalActiveProjects: 0,
    projectsInProgress: 0,
    completedProjects: 0,
    pendingActions: 0,
  };

  const activeProjects: ActiveProject[] = dashboard?.activeProjects ?? [];

  const formatTimestamp = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "Unknown time";
    return date.toLocaleString();
  };

  const recentActivities = useMemo(() => {
    const activities = dashboard?.recentActivities ?? [];
    return activities.map((activity) => {
      switch (activity.type) {
        case "notification":
          return {
            ...activity,
            icon: AlertCircle,
            iconColor: activity.unread ? "#ff9800" : "#4169e1",
          };
        case "document":
          return {
            ...activity,
            icon: FileText,
            iconColor: "#4169e1",
          };
        case "update":
        default:
          return {
            ...activity,
            icon: CheckCircle2,
            iconColor: "#4caf50",
          };
      }
    });
  }, [dashboard]);

  // Unread messages count
  const unreadCount = recentActivities.filter(
    (activity) => activity.unread,
  ).length;

  const getStatusBadgeStyle = (status: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage="client"
        userName={userData?.name}
        userEmail={userData?.email}
      />
      <ClientSidebar activeItem="dashboard" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: "#001f54" }}>
              Client Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Overview of your active projects and overall project health
            </p>
          </div>

          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Active Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <FolderKanban
                    className="w-6 h-6"
                    style={{ color: "#4169e1" }}
                  />
                </div>
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#001f54" }}
              >
                {summaryStats.totalActiveProjects}
              </div>
              <p className="text-sm text-gray-600">Total Active Projects</p>
            </div>

            {/* Projects In Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <Clock className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#001f54" }}
              >
                {summaryStats.projectsInProgress}
              </div>
              <p className="text-sm text-gray-600">Projects In Progress</p>
            </div>

            {/* Completed Projects */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#4caf5020" }}
                >
                  <CircleCheck
                    className="w-6 h-6"
                    style={{ color: "#4caf50" }}
                  />
                </div>
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#001f54" }}
              >
                {summaryStats.completedProjects}
              </div>
              <p className="text-sm text-gray-600">Completed Projects</p>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#ff980020" }}
                >
                  <AlertCircle
                    className="w-6 h-6"
                    style={{ color: "#ff9800" }}
                  />
                </div>
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "#001f54" }}
              >
                {summaryStats.pendingActions}
              </div>
              <p className="text-sm text-gray-600">Pending Actions</p>
            </div>
          </div>

          {/* Main Content - Projects and Activity Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Health Cards - Main Section (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: "#001f54" }}
              >
                Project Health
              </h2>

              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: "#001f54" }}
                      >
                        {project.name}
                      </h3>
                      <span
                        className="inline-block text-xs px-3 py-1 rounded-full font-medium"
                        style={getStatusBadgeStyle(project.status)}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
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
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: project.statusColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Milestone Summary */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 font-medium mb-1">
                      Key Milestone:
                    </p>
                    <p className="text-sm text-gray-700">{project.milestone}</p>
                  </div>

                  {/* Last Update */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    Last updated {formatTimestamp(project.lastUpdate)}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Sidebar - Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                {/* Header with Unread Indicator */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Recent Activity
                  </h2>
                  {unreadCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5" style={{ color: "#4169e1" }} />
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: "#ff4444" }}
                      >
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Activity Feed */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className={`p-4 rounded-lg border transition-all duration-200 ${
                          activity.unread
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: `${activity.iconColor}20`,
                            }}
                          >
                            <IconComponent
                              className="w-5 h-5"
                              style={{ color: activity.iconColor }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4
                              className="text-sm font-semibold mb-1"
                              style={{ color: "#001f54" }}
                            >
                              {activity.title}
                              {activity.unread && (
                                <span
                                  className="ml-2 w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: "#4169e1" }}
                                />
                              )}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {activity.description}
                            </p>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* View All Button */}
                <button
                  className="w-full mt-4 px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all"
                  style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                >
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
