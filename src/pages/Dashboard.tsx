import AuthNavbar from '../components/AuthNavbar';
import { LayoutDashboard, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  // Sample data
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      icon: Users,
      color: '#4169e1',
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+8.2%',
      icon: DollarSign,
      color: '#a7fc00',
    },
    {
      title: 'Growth',
      value: '23.5%',
      change: '+4.3%',
      icon: TrendingUp,
      color: '#4169e1',
    },
    {
      title: 'Active Projects',
      value: '12',
      change: '+2',
      icon: LayoutDashboard,
      color: '#a7fc00',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New user registered',
      time: '5 minutes ago',
      user: 'Jane Smith',
    },
    {
      id: 2,
      action: 'Project completed',
      time: '1 hour ago',
      user: 'Mike Johnson',
    },
    {
      id: 3,
      action: 'New payment received',
      time: '2 hours ago',
      user: 'Sarah Williams',
    },
    {
      id: 4,
      action: 'Report generated',
      time: '3 hours ago',
      user: 'System',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Navbar */}
      <AuthNavbar
        currentPage="dashboard"
        userName="John Doe"
        userEmail="john.doe@example.com"
        notificationCount={3}
      />

      {/* Main Content */}
      <main className="pt-16">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: '#001f54' }}>
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back, John! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                    <span className="text-sm text-green-600 font-semibold">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold" style={{ color: '#001f54' }}>
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#001f54' }}>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2"
                      style={{ backgroundColor: '#4169e1' }}
                    />
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: '#001f54' }}>
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#001f54' }}>
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  className="w-full px-4 py-3 rounded-lg text-white text-left hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#4169e1' }}
                >
                  Create New Project
                </button>
                <button
                  className="w-full px-4 py-3 rounded-lg text-[#001f54] text-left hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#a7fc00' }}
                >
                  Generate Report
                </button>
                <button
                  className="w-full px-4 py-3 rounded-lg text-left border-2 hover:bg-gray-50 transition-all"
                  style={{ borderColor: '#4169e1', color: '#4169e1' }}
                >
                  View Analytics
                </button>
                <button
                  className="w-full px-4 py-3 rounded-lg text-left border-2 hover:bg-gray-50 transition-all"
                  style={{ borderColor: '#4169e1', color: '#4169e1' }}
                >
                  Manage Team
                </button>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#001f54' }}>
              Active Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((project) => (
                <div
                  key={project}
                  className="p-4 rounded-lg border border-gray-200 hover:border-[#4169e1] transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold" style={{ color: '#001f54' }}>
                      Project {project}
                    </h3>
                    <span
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: '#4169e1' }}
                    >
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Building a modern web application with React and TypeScript
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold" style={{ color: '#001f54' }}>
                      {project * 25}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${project * 25}%`,
                        backgroundColor: '#a7fc00',
                      }}
                    />
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
