import AuthNavbar from '../../components/AuthNavbar';
import ClientSidebar from '../../components/ClientSidebar';
import {
  Calendar,
  CircleCheck,
  Download,
  FileText,
  User,
  Clock,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';

export default function ClientDashboard() {
  // Mock data for insights
  const projectCompletion = 73;
  const milestonesCompleted = 8;
  const totalMilestones = 12;
  const nextMeetingDate = 'Jan 10, 2026';
  const nextMeetingTime = '2:00 PM EST';

  // Mock timeline data
  const timelineEvents = [
    {
      id: 1,
      title: 'Project Kickoff',
      date: 'Dec 1, 2025',
      status: 'completed',
      description: 'Initial meeting and requirements gathering',
    },
    {
      id: 2,
      title: 'Design Phase Complete',
      date: 'Dec 15, 2025',
      status: 'completed',
      description: 'UI/UX designs approved',
    },
    {
      id: 3,
      title: 'Development Milestone 1',
      date: 'Dec 28, 2025',
      status: 'completed',
      description: 'Core features implementation',
    },
    {
      id: 4,
      title: 'Testing & QA',
      date: 'Jan 10, 2026',
      status: 'in-progress',
      description: 'Quality assurance and bug fixes',
    },
    {
      id: 5,
      title: 'Final Delivery',
      date: 'Jan 25, 2026',
      status: 'upcoming',
      description: 'Production deployment',
    },
  ];

  // Mock reports data
  const reports = [
    { id: 1, name: 'Q4 Analytics Report', date: 'Dec 30, 2025', size: '2.4 MB', type: 'PDF' },
    { id: 2, name: 'User Research Summary', date: 'Dec 28, 2025', size: '1.8 MB', type: 'PDF' },
    { id: 3, name: 'Technical Specifications', date: 'Dec 20, 2025', size: '3.1 MB', type: 'DOCX' },
    { id: 4, name: 'Design Assets Package', date: 'Dec 15, 2025', size: '12.5 MB', type: 'ZIP' },
  ];

  // Mock communication history
  const messages = [
    {
      id: 1,
      sender: 'Project Manager',
      initials: 'PM',
      message: 'The latest design mockups have been uploaded to the Reports section. Please review and share your feedback by EOD.',
      timestamp: '2 hours ago',
      isClient: false,
    },
    {
      id: 2,
      sender: 'You',
      initials: 'YO',
      message: 'Thank you! The designs look great. I have a few minor suggestions for the dashboard layout.',
      timestamp: '1 hour ago',
      isClient: true,
    },
    {
      id: 3,
      sender: 'Lead Developer',
      initials: 'LD',
      message: 'Development on the new analytics module is progressing well. We\'re on track for the Jan 10th milestone.',
      timestamp: '45 minutes ago',
      isClient: false,
    },
    {
      id: 4,
      sender: 'You',
      initials: 'YO',
      message: 'Excellent! Looking forward to seeing it in action.',
      timestamp: '30 minutes ago',
      isClient: true,
    },
  ];

  // Mock upcoming schedule
  const upcomingEvents = [
    {
      id: 1,
      title: 'Project Review Meeting',
      date: 'Jan 10, 2026',
      time: '2:00 PM EST',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Deliverable Due: Testing Report',
      date: 'Jan 12, 2026',
      time: 'End of Day',
      type: 'deadline',
    },
    {
      id: 3,
      title: 'Monthly Status Call',
      date: 'Jan 15, 2026',
      time: '10:00 AM EST',
      type: 'meeting',
    },
    {
      id: 4,
      title: 'Final Presentation',
      date: 'Jan 25, 2026',
      time: '3:00 PM EST',
      type: 'meeting',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in-progress':
        return '#4169e1';
      case 'upcoming':
        return '#717182';
      default:
        return '#717182';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="client" />
      <ClientSidebar activeItem="dashboard" />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl" style={{ color: '#001f54' }}>Client Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your projects and progress</p>
          </div>

          {/* Top Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Project Completion Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  {/* Circular Progress */}
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#4169e1"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - projectCompletion / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color: '#4169e1' }}>
                      {projectCompletion}%
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1" style={{ color: '#001f54' }}>
                  Project Completion
                </h3>
                <p className="text-sm text-gray-500 text-center">Overall progress across all milestones</p>
              </div>
            </div>

            {/* Milestones Completed Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#a7fc0020' }}
                >
                  <CircleCheck className="w-10 h-10" style={{ color: '#4caf50' }} />
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: '#001f54' }}>
                    {milestonesCompleted}
                    <span className="text-xl text-gray-400">/{totalMilestones}</span>
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: '#001f54' }}>
                    Milestones Completed
                  </h3>
                  <p className="text-sm text-gray-500">
                    {Math.round((milestonesCompleted / totalMilestones) * 100)}% of total goals achieved
                  </p>
                </div>
              </div>
            </div>

            {/* Next Meeting Card */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex flex-col items-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#4169e120' }}
                >
                  <Calendar className="w-10 h-10" style={{ color: '#4169e1' }} />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2" style={{ color: '#001f54' }}>
                    Next Meeting
                  </h3>
                  <div className="text-2xl font-bold mb-1" style={{ color: '#4169e1' }}>
                    {nextMeetingDate}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{nextMeetingTime}</p>
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                    style={{ backgroundColor: '#a7fc00', color: '#001f54' }}
                  >
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Project Timeline - Left (2/3 width) */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6" style={{ color: '#4169e1' }} />
                <h2 className="text-2xl font-semibold" style={{ color: '#001f54' }}>
                  Project Timeline
                </h2>
              </div>

              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex gap-4">
                    {/* Timeline Line */}
                    {index !== timelineEvents.length - 1 && (
                      <div
                        className="absolute left-5 top-12 w-0.5 h-full"
                        style={{ backgroundColor: '#e5e7eb' }}
                      />
                    )}

                    {/* Status Circle */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border-4 border-white"
                        style={{
                          backgroundColor: getStatusColor(event.status),
                        }}
                      >
                        {event.status === 'completed' && (
                          <CircleCheck className="w-5 h-5 text-white" />
                        )}
                        {event.status === 'in-progress' && (
                          <Clock className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold" style={{ color: '#001f54' }}>
                          {event.title}
                        </h4>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(event.status)}20`,
                            color: getStatusColor(event.status),
                          }}
                        >
                          {event.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reports & Deliverables - Right (1/3 width) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6" style={{ color: '#4169e1' }} />
                <h2 className="text-xl font-semibold" style={{ color: '#001f54' }}>
                  Reports & Deliverables
                </h2>
              </div>

              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 border rounded-lg hover:shadow-md transition-all duration-200"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate" style={{ color: '#001f54' }}>
                          {report.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {report.date} • {report.size}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded font-medium ml-2"
                        style={{ backgroundColor: '#4169e120', color: '#4169e1' }}
                      >
                        {report.type}
                      </span>
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md mt-2"
                      style={{ backgroundColor: '#a7fc00', color: '#001f54' }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Communication History */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-6 h-6" style={{ color: '#4169e1' }} />
                  <h2 className="text-2xl font-semibold" style={{ color: '#001f54' }}>
                    Communication History
                  </h2>
                </div>
                <button className="text-sm hover:underline" style={{ color: '#4169e1' }}>
                  View All
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isClient ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
                      style={{
                        backgroundColor: msg.isClient ? '#a7fc00' : '#4169e1',
                        color: msg.isClient ? '#001f54' : 'white',
                      }}
                    >
                      {msg.initials}
                    </div>
                    <div className={`flex-1 ${msg.isClient ? 'items-end' : ''}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: '#001f54' }}
                        >
                          {msg.sender}
                        </p>
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isClient ? 'bg-gray-100' : 'bg-blue-50'
                        }`}
                      >
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reply */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#e5e7eb', '--tw-ring-color': '#4169e1' } as React.CSSProperties}
                  />
                  <button
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md"
                    style={{ backgroundColor: '#4169e1' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6" style={{ color: '#4169e1' }} />
                <h2 className="text-2xl font-semibold" style={{ color: '#001f54' }}>
                  Upcoming Schedule
                </h2>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-lg border-l-4 hover:shadow-md transition-all duration-200"
                    style={{
                      backgroundColor: event.type === 'meeting' ? '#f0f9ff' : '#fff3e0',
                      borderLeftColor: event.type === 'meeting' ? '#4169e1' : '#ff9800',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm" style={{ color: '#001f54' }}>
                        {event.title}
                      </h4>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: event.type === 'meeting' ? '#4169e120' : '#ff980020',
                          color: event.type === 'meeting' ? '#4169e1' : '#ff9800',
                        }}
                      >
                        {event.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Event Button */}
              <button
                className="w-full mt-4 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                style={{ backgroundColor: '#a7fc00', color: '#001f54' }}
              >
                + Schedule New Meeting
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}