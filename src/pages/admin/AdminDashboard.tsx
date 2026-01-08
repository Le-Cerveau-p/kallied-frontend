import AuthNavbar from '../../components/AuthNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import {
  Briefcase,
  Users,
  TrendingUp,
  TriangleAlert,
  Calendar,
  Activity,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  // Mock data for revenue chart
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 40000 },
    { month: 'Feb', revenue: 52000, target: 45000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 55000, target: 60000 },
    { month: 'Jun', revenue: 67000, target: 65000 },
  ];

  // Mock data for upcoming deadlines
  const upcomingDeadlines = [
    { id: 1, project: 'Q1 Financial Report', date: 'Jan 10, 2026', priority: 'high', daysLeft: 4 },
    { id: 2, project: 'Product Launch Phase 2', date: 'Jan 15, 2026', priority: 'high', daysLeft: 9 },
    { id: 3, project: 'Client Onboarding - TechCorp', date: 'Jan 18, 2026', priority: 'medium', daysLeft: 12 },
    { id: 4, project: 'Security Audit Review', date: 'Jan 22, 2026', priority: 'medium', daysLeft: 16 },
    { id: 5, project: 'Marketing Campaign Q1', date: 'Jan 25, 2026', priority: 'low', daysLeft: 19 },
  ];

  // Mock data for activity log
  const activityLog = [
    { id: 1, user: 'Sarah Johnson', action: 'Completed project milestone', project: 'Website Redesign', time: '10 minutes ago' },
    { id: 2, user: 'Mike Chen', action: 'Updated task status', project: 'Mobile App Development', time: '25 minutes ago' },
    { id: 3, user: 'Emily Rodriguez', action: 'Added new team member', project: 'Infrastructure Upgrade', time: '1 hour ago' },
    { id: 4, user: 'David Kim', action: 'Submitted report', project: 'Q4 Analytics', time: '2 hours ago' },
    { id: 5, user: 'Lisa Anderson', action: 'Resolved critical bug', project: 'API Integration', time: '3 hours ago' },
  ];

  // Mock data for risk alerts
  const riskAlerts = [
    { id: 1, project: 'Cloud Migration', type: 'delay', severity: 'high', message: 'Project is 3 days behind schedule' },
    { id: 2, project: 'Data Analytics Platform', type: 'budget', severity: 'medium', message: 'Budget utilization at 85%' },
    { id: 3, project: 'Customer Portal', type: 'resource', severity: 'high', message: '2 key team members on leave' },
    { id: 4, project: 'API Modernization', type: 'dependency', severity: 'low', message: 'Waiting on third-party approval' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#d4183d';
      case 'medium':
        return '#4169e1';
      case 'low':
        return '#a7fc00';
      default:
        return '#717182';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#d4183d';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#a7fc00';
      default:
        return '#717182';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="admin" />
      <AdminSidebar activeItem="dashboard" />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: '#001f54' }}>Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive overview of business operations and key metrics</p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Active Projects */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#e3f2fd' }}>
                  <Briefcase className="w-6 h-6" style={{ color: '#4169e1' }} />
                </div>
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  12%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Total Active Projects</h3>
              <p className="text-3xl" style={{ color: '#001f54' }}>24</p>
              <p className="text-xs text-gray-500 mt-2">8 completed this month</p>
            </div>

            {/* Staff Workload Distribution */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#f3e5f5' }}>
                  <Users className="w-6 h-6" style={{ color: '#9c27b0' }} />
                </div>
                <span className="flex items-center text-orange-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  5%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Staff Workload</h3>
              <p className="text-3xl" style={{ color: '#001f54' }}>78%</p>
              <p className="text-xs text-gray-500 mt-2">Average capacity utilization</p>
            </div>

            {/* Revenue Overview */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                  <TrendingUp className="w-6 h-6" style={{ color: '#4caf50' }} />
                </div>
                <span className="flex items-center text-green-600 text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  18%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Revenue Overview</h3>
              <p className="text-3xl" style={{ color: '#001f54' }}>$67K</p>
              <p className="text-xs text-gray-500 mt-2">June 2026 revenue</p>
            </div>

            {/* Risk/Delay Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#ffebee' }}>
                  <TriangleAlert className="w-6 h-6" style={{ color: '#d4183d' }} />
                </div>
                <span className="flex items-center text-red-600 text-sm">
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                  2
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">Risk/Delay Alerts</h3>
              <p className="text-3xl" style={{ color: '#001f54' }}>4</p>
              <p className="text-xs text-gray-500 mt-2">Requires immediate attention</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Wider (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#e3f2fd' }}>
                      <Calendar className="w-5 h-5" style={{ color: '#4169e1' }} />
                    </div>
                    <h2 className="text-xl" style={{ color: '#001f54' }}>Upcoming Deadlines</h2>
                  </div>
                  <button className="text-sm hover:underline" style={{ color: '#4169e1' }}>
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium" style={{ color: '#001f54' }}>{deadline.project}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {deadline.date}
                          </span>
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${getPriorityColor(deadline.priority)}20`,
                              color: getPriorityColor(deadline.priority),
                            }}
                          >
                            {deadline.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium" style={{ color: '#4169e1' }}>
                          {deadline.daysLeft} days
                        </p>
                        <p className="text-xs text-gray-500">remaining</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#f3e5f5' }}>
                      <Activity className="w-5 h-5" style={{ color: '#9c27b0' }} />
                    </div>
                    <h2 className="text-xl" style={{ color: '#001f54' }}>Activity Log</h2>
                  </div>
                  <button className="text-sm hover:underline" style={{ color: '#4169e1' }}>
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#4169e1' }}>
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium" style={{ color: '#001f54' }}>{activity.user}</span>
                          {' '}
                          <span className="text-gray-600">{activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.project}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (1/3) */}
            <div className="space-y-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#e8f5e9' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#4caf50' }} />
                  </div>
                  <h2 className="text-xl" style={{ color: '#001f54' }}>Revenue Trend</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#717182" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#717182" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#4169e1" 
                      strokeWidth={3}
                      name="Revenue" 
                      dot={{ fill: '#4169e1', r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#a7fc00" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target" 
                      dot={{ fill: '#a7fc00', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Project Risk Alerts */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#ffebee' }}>
                    <AlertCircle className="w-5 h-5" style={{ color: '#d4183d' }} />
                  </div>
                  <h2 className="text-xl" style={{ color: '#001f54' }}>Risk Alerts</h2>
                </div>
                <div className="space-y-3">
                  {riskAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-4 rounded-lg border-l-4"
                      style={{
                        backgroundColor: `${getSeverityColor(alert.severity)}10`,
                        borderLeftColor: getSeverityColor(alert.severity),
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium" style={{ color: '#001f54' }}>
                          {alert.project}
                        </h4>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: getSeverityColor(alert.severity),
                            color: 'white',
                          }}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{alert.message}</p>
                      <button 
                        className="text-xs mt-2 hover:underline"
                        style={{ color: '#4169e1' }}
                      >
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}