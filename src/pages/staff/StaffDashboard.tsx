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

export default function StaffDashboard() {
  // Mock data for stat tiles
  const stats = [
    {
      id: 1,
      label: "Assigned Tasks",
      value: "12",
      icon: CheckSquare,
      color: "#4169e1",
      bgColor: "#e3f2fd",
    },
    {
      id: 2,
      label: "Tasks Due Soon",
      value: "4",
      icon: Clock,
      color: "#ff9800",
      bgColor: "#fff3e0",
    },
    {
      id: 3,
      label: "Completed Tasks",
      value: "28",
      icon: CheckCircle2,
      color: "#4caf50",
      bgColor: "#e8f5e9",
    },
    {
      id: 4,
      label: "Notifications",
      value: "7",
      icon: Bell,
      color: "#d4183d",
      bgColor: "#ffebee",
    },
  ];

  // Mock data for assigned tasks
  const assignedTasks = [
    {
      id: 1,
      title: "Update Q1 Financial Report",
      project: "Finance Operations",
      dueDate: "Jan 8, 2026",
      priority: "high",
      status: "in-progress",
      progress: 60,
    },
    {
      id: 2,
      title: "Review Client Feedback Forms",
      project: "Customer Success",
      dueDate: "Jan 10, 2026",
      priority: "medium",
      status: "in-progress",
      progress: 40,
    },
    {
      id: 3,
      title: "Prepare Sales Presentation",
      project: "Sales Team",
      dueDate: "Jan 12, 2026",
      priority: "high",
      status: "pending",
      progress: 15,
    },
    {
      id: 4,
      title: "Data Quality Audit",
      project: "Data Analytics",
      dueDate: "Jan 15, 2026",
      priority: "medium",
      status: "pending",
      progress: 0,
    },
    {
      id: 5,
      title: "Update Training Materials",
      project: "HR Department",
      dueDate: "Jan 18, 2026",
      priority: "low",
      status: "pending",
      progress: 0,
    },
  ];

  // Mock data for projects
  const projects = [
    { id: 1, name: "Website Redesign", progress: 75, color: "#4169e1" },
    { id: 2, name: "Mobile App Development", progress: 45, color: "#9c27b0" },
    { id: 3, name: "Infrastructure Upgrade", progress: 90, color: "#4caf50" },
    { id: 4, name: "Marketing Campaign", progress: 30, color: "#ff9800" },
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: 1,
      type: "comment",
      user: "Sarah Johnson",
      message:
        'Commented on "Q1 Financial Report" - Please review the updated figures in section 3.',
      time: "15 minutes ago",
      isUnread: true,
    },
    {
      id: 2,
      type: "alert",
      user: "System",
      message: 'Task "Review Client Feedback Forms" is due in 2 days',
      time: "1 hour ago",
      isUnread: true,
    },
    {
      id: 3,
      type: "comment",
      user: "Mike Chen",
      message:
        'Mentioned you in "Sales Presentation" - Can you help with the analytics section?',
      time: "3 hours ago",
      isUnread: false,
    },
    {
      id: 4,
      type: "alert",
      user: "System",
      message: 'New document uploaded to "Data Analytics" project',
      time: "5 hours ago",
      isUnread: false,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#d4183d";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#717182";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "#4169e1";
      case "pending":
        return "#717182";
      case "completed":
        return "#4caf50";
      default:
        return "#717182";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="staff" />
      <StaffSidebar activeItem="dashboard" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: "#001f54" }}>
              My Work Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Track your tasks, projects, and stay productive
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
            {/* Left Panel - My Assigned Tasks (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className="text-2xl font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    My Assigned Tasks
                  </h2>
                  <button
                    className="text-sm px-4 py-2 rounded-lg hover:shadow-md transition-all"
                    style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {assignedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-all duration-200"
                      style={{ borderColor: "#e0e0e0" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4
                            className="font-medium mb-1"
                            style={{ color: "#001f54" }}
                          >
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {task.project}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due: {task.dueDate}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${getPriorityColor(task.priority)}20`,
                            color: getPriorityColor(task.priority),
                          }}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(task.status)}20`,
                            color: getStatusColor(task.status),
                          }}
                        >
                          {task.status.replace("-", " ").toUpperCase()}
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
                            {task.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${task.progress}%`,
                              backgroundColor: "#4169e1",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Data</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:shadow-lg transition-all duration-200"
                    style={{ backgroundColor: "#9c27b0" }}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">Submit Report</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-200"
                    style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Create Task</span>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold mb-4" style={{ color: "#001f54" }}>
                  This Week
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Tasks Completed
                    </span>
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "#4caf50" }}
                    >
                      8
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Hours Logged</span>
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "#4169e1" }}
                    >
                      32
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Reports Submitted
                    </span>
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "#9c27b0" }}
                    >
                      3
                    </span>
                  </div>
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
              {projects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium" style={{ color: "#001f54" }}>
                      {project.name}
                    </h4>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: project.color }}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${project.progress}%`,
                        backgroundColor: project.color,
                      }}
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
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    notification.isUnread ? "bg-blue-50" : "bg-gray-50"
                  }`}
                  style={{
                    borderLeftColor: notification.isUnread
                      ? "#4169e1"
                      : "#e0e0e0",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-medium"
                      style={{
                        backgroundColor:
                          notification.type === "alert" ? "#ff9800" : "#4169e1",
                      }}
                    >
                      {notification.type === "alert" ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        notification.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className="font-medium text-sm"
                          style={{ color: "#001f54" }}
                        >
                          {notification.user}
                        </p>
                        {notification.isUnread && (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: "#4169e1" }}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
