import { useEffect, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  Bell,
  Upload,
  FileText,
  Plus,
  AlertCircle,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import { getStaffDashboard } from "../../api/staff";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/users";

interface DashboardData {
  stats: {
    assignedProjects: number;
    activeProjects: number;
    completedProjects: number;
    unreadNotifications: number;
  };

  projectProgress: {
    id: string;
    name: string;
    progress: number;
    status: string;
  }[];

  notifications: any[];
  activity: any[];
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function StaffDashboard() {
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
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getStaffDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = dashboard
    ? [
        {
          id: "assigned",
          label: "Assigned Projects",
          value: dashboard.stats.assignedProjects,
          icon: CheckSquare,
          color: "#4169e1",
          bgColor: "#e3f2fd",
        },
        {
          id: "active",
          label: "Active Projects",
          value: dashboard.stats.activeProjects,
          icon: Clock,
          color: "#ff9800",
          bgColor: "#fff3e0",
        },
        {
          id: "completed",
          label: "Completed Projects",
          value: dashboard.stats.completedProjects,
          icon: CheckCircle2,
          color: "#4caf50",
          bgColor: "#e8f5e9",
        },
        {
          id: "notifications",
          label: "Notifications",
          value: dashboard.stats.unreadNotifications,
          icon: Bell,
          color: "#d4183d",
          bgColor: "#ffebee",
        },
      ]
    : [];

  const getPrimaryProjectId = () =>
    dashboard?.projectProgress?.[0]?.id ?? null;

  const goToProjectTab = (tab: "documents" | "procurement") => {
    const projectId = getPrimaryProjectId();
    if (!projectId) {
      navigate("/staff/projects");
      return;
    }
    navigate(`/staff/projects/${projectId}?tab=${tab}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar currentPage="staff" />
        <StaffSidebar activeItem="dashboard" />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
          <div className="max-w-7xl mx-auto">
            {/* Page Heading */}
            <div className="mb-8">
              <h1 className="text-4xl" style={{ color: "#001f54" }}>
                Loading dashboard...
              </h1>
            </div>
          </div>
        </main>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage="dashboard"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <StaffSidebar activeItem="dashboard" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: "#001f54" }}>
              My Work Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your projects, and stay productive
            </p>
          </div>

          {/* Statistics Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.label}</h3>
                  <p
                    className="text-3xl font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Right Panel - Quick Actions (1/3 width) */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold mb-4" style={{ color: "#001f54" }}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:shadow-lg transition-all duration-200"
                    style={{ backgroundColor: "#4169e1" }}
                    onClick={() => goToProjectTab("documents")}
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Data</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:shadow-lg transition-all duration-200"
                    style={{ backgroundColor: "#9c27b0" }}
                    onClick={() => goToProjectTab("documents")}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">Submit Report</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                    style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                    onClick={() => goToProjectTab("procurement")}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Create Procurement Request
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Project Progress Section */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6" style={{ color: "#4169e1" }} />
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#001f54" }}
              >
                Project Progress
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboard?.projectProgress.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between">
                    <h4>{project.name}</h4>
                    <span>{project.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6" style={{ color: "#4169e1" }} />
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: "#001f54" }}
                >
                  Notifications & Alerts
                </h2>
              </div>
              <button
                className="text-sm hover:underline"
                style={{ color: "#4169e1" }}
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {dashboard?.notifications.map((n) => (
                <div key={n.id}>
                  <p>{n.title}</p>
                  <p>{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
