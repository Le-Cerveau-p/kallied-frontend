import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Settings,
  Building,
  Bell,
  Shield,
  Save,
  AlertCircle,
  CheckCircle,
  Mail,
  Globe,
  Phone,
  MapPin,
  Users,
  Eye,
  Edit,
  Lock,
} from "lucide-react";

interface CompanyProfile {
  companyName: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  employees: string;
}

interface NotificationPreferences {
  projectUpdates: boolean;
  procurementRequests: boolean;
  userActivity: boolean;
  systemAlerts: boolean;
  weeklyReports: boolean;
  budgetAlerts: boolean;
  contractExpirations: boolean;
  invoiceReminders: boolean;
  emailDigestFrequency: "realtime" | "daily" | "weekly";
}

interface RolePermission {
  role: string;
  permissions: {
    viewProjects: boolean;
    editProjects: boolean;
    viewUsers: boolean;
    editUsers: boolean;
    viewFinancials: boolean;
    editFinancials: boolean;
    viewReports: boolean;
    systemSettings: boolean;
  };
}

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState<
    "company" | "notifications" | "permissions"
  >("company");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>({
    companyName: "Tech Solutions Inc.",
    industry: "Information Technology",
    website: "www.techsolutions.com",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Boulevard",
    city: "San Francisco",
    state: "California",
    zipCode: "94105",
    country: "United States",
    taxId: "12-3456789",
    employees: "50-100",
  });

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreferences>({
      projectUpdates: true,
      procurementRequests: true,
      userActivity: false,
      systemAlerts: true,
      weeklyReports: true,
      budgetAlerts: true,
      contractExpirations: true,
      invoiceReminders: true,
      emailDigestFrequency: "daily",
    });

  // Role Permissions (Read-only)
  const rolePermissions: RolePermission[] = [
    {
      role: "Administrator",
      permissions: {
        viewProjects: true,
        editProjects: true,
        viewUsers: true,
        editUsers: true,
        viewFinancials: true,
        editFinancials: true,
        viewReports: true,
        systemSettings: true,
      },
    },
    {
      role: "Project Manager",
      permissions: {
        viewProjects: true,
        editProjects: true,
        viewUsers: true,
        editUsers: false,
        viewFinancials: true,
        editFinancials: false,
        viewReports: true,
        systemSettings: false,
      },
    },
    {
      role: "Staff Member",
      permissions: {
        viewProjects: true,
        editProjects: false,
        viewUsers: false,
        editUsers: false,
        viewFinancials: false,
        editFinancials: false,
        viewReports: true,
        systemSettings: false,
      },
    },
    {
      role: "Client",
      permissions: {
        viewProjects: true,
        editProjects: false,
        viewUsers: false,
        editUsers: false,
        viewFinancials: true,
        editFinancials: false,
        viewReports: true,
        systemSettings: false,
      },
    },
  ];

  const handleCompanyProfileChange = (
    field: keyof CompanyProfile,
    value: string,
  ) => {
    setCompanyProfile({ ...companyProfile, [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleNotificationChange = (
    field: keyof NotificationPreferences,
    value: boolean | string,
  ) => {
    setNotificationPrefs({ ...notificationPrefs, [field]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setSaveSuccess(true);
    setHasUnsavedChanges(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="settings" />

      <main className="lg:pl-64 pt-16">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#e6f0ff" }}
              >
                <Settings className="w-6 h-6" style={{ color: "#4169e1" }} />
              </div>
              <div>
                <h1 className="text-2xl" style={{ color: "#001f54" }}>
                  System Settings
                </h1>
                <p className="text-gray-600 text-sm">
                  Configure system behavior and preferences
                </p>
              </div>
            </div>
          </div>

          {/* Unsaved Changes Alert */}
          {hasUnsavedChanges && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">
                  You have unsaved changes. Don't forget to save your updates.
                </p>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-white text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ backgroundColor: "#4169e1" }}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">
                Settings saved successfully!
              </p>
            </div>
          )}

          {/* Section Navigation */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveSection("company")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === "company"
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{
                  color: activeSection === "company" ? "#4169e1" : "#6b7280",
                }}
              >
                <Building className="w-5 h-5" />
                Company Profile
              </button>
              <button
                onClick={() => setActiveSection("notifications")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === "notifications"
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{
                  color:
                    activeSection === "notifications" ? "#4169e1" : "#6b7280",
                }}
              >
                <Bell className="w-5 h-5" />
                Notification Preferences
              </button>
              <button
                onClick={() => setActiveSection("permissions")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === "permissions"
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                style={{
                  color:
                    activeSection === "permissions" ? "#4169e1" : "#6b7280",
                }}
              >
                <Shield className="w-5 h-5" />
                Role Permissions
              </button>
            </div>
          </div>

          {/* Company Profile Section */}
          {activeSection === "company" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg mb-6" style={{ color: "#001f54" }}>
                Company Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyProfile.companyName}
                    onChange={(e) =>
                      handleCompanyProfileChange("companyName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Industry
                  </label>
                  <select
                    value={companyProfile.industry}
                    onChange={(e) =>
                      handleCompanyProfileChange("industry", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={companyProfile.website}
                      onChange={(e) =>
                        handleCompanyProfileChange("website", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={companyProfile.email}
                      onChange={(e) =>
                        handleCompanyProfileChange("email", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={companyProfile.phone}
                      onChange={(e) =>
                        handleCompanyProfileChange("phone", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={companyProfile.address}
                      onChange={(e) =>
                        handleCompanyProfileChange("address", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    value={companyProfile.city}
                    onChange={(e) =>
                      handleCompanyProfileChange("city", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={companyProfile.state}
                    onChange={(e) =>
                      handleCompanyProfileChange("state", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Zip/Postal Code
                  </label>
                  <input
                    type="text"
                    value={companyProfile.zipCode}
                    onChange={(e) =>
                      handleCompanyProfileChange("zipCode", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    value={companyProfile.country}
                    onChange={(e) =>
                      handleCompanyProfileChange("country", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    value={companyProfile.taxId}
                    onChange={(e) =>
                      handleCompanyProfileChange("taxId", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Employees */}
                <div>
                  <label className="block text-sm mb-2 text-gray-700">
                    Number of Employees
                  </label>
                  <select
                    value={companyProfile.employees}
                    onChange={(e) =>
                      handleCompanyProfileChange("employees", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="50-100">50-100</option>
                    <option value="101-500">101-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Preferences Section */}
          {activeSection === "notifications" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg mb-6" style={{ color: "#001f54" }}>
                Email Notifications
              </h2>

              <div className="space-y-6">
                {/* Email Digest Frequency */}
                <div className="pb-6 border-b border-gray-200">
                  <label className="block text-sm mb-3 text-gray-700">
                    Email Digest Frequency
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="emailDigest"
                        value="realtime"
                        checked={
                          notificationPrefs.emailDigestFrequency === "realtime"
                        }
                        onChange={(e) =>
                          handleNotificationChange(
                            "emailDigestFrequency",
                            e.target.value,
                          )
                        }
                        className="w-4 h-4"
                        style={{ accentColor: "#4169e1" }}
                      />
                      <span className="text-gray-700">Real-time</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="emailDigest"
                        value="daily"
                        checked={
                          notificationPrefs.emailDigestFrequency === "daily"
                        }
                        onChange={(e) =>
                          handleNotificationChange(
                            "emailDigestFrequency",
                            e.target.value,
                          )
                        }
                        className="w-4 h-4"
                        style={{ accentColor: "#4169e1" }}
                      />
                      <span className="text-gray-700">Daily Digest</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="emailDigest"
                        value="weekly"
                        checked={
                          notificationPrefs.emailDigestFrequency === "weekly"
                        }
                        onChange={(e) =>
                          handleNotificationChange(
                            "emailDigestFrequency",
                            e.target.value,
                          )
                        }
                        className="w-4 h-4"
                        style={{ accentColor: "#4169e1" }}
                      />
                      <span className="text-gray-700">Weekly Digest</span>
                    </label>
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-4">
                  {/* Project Updates */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">Project Updates</p>
                      <p className="text-sm text-gray-500">
                        Notifications about project status changes and
                        milestones
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.projectUpdates}
                        onChange={(e) =>
                          handleNotificationChange(
                            "projectUpdates",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Procurement Requests */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">Procurement Requests</p>
                      <p className="text-sm text-gray-500">
                        Alerts for new procurement requests requiring approval
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.procurementRequests}
                        onChange={(e) =>
                          handleNotificationChange(
                            "procurementRequests",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* User Activity */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">User Activity</p>
                      <p className="text-sm text-gray-500">
                        Notifications about user logins and account changes
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.userActivity}
                        onChange={(e) =>
                          handleNotificationChange(
                            "userActivity",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* System Alerts */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">System Alerts</p>
                      <p className="text-sm text-gray-500">
                        Critical system notifications and maintenance updates
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.systemAlerts}
                        onChange={(e) =>
                          handleNotificationChange(
                            "systemAlerts",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">Weekly Reports</p>
                      <p className="text-sm text-gray-500">
                        Automated weekly summary reports
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.weeklyReports}
                        onChange={(e) =>
                          handleNotificationChange(
                            "weeklyReports",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Budget Alerts */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">Budget Alerts</p>
                      <p className="text-sm text-gray-500">
                        Notifications when project budgets exceed thresholds
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.budgetAlerts}
                        onChange={(e) =>
                          handleNotificationChange(
                            "budgetAlerts",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Contract Expirations */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-gray-900">Contract Expirations</p>
                      <p className="text-sm text-gray-500">
                        Reminders about upcoming contract renewals
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.contractExpirations}
                        onChange={(e) =>
                          handleNotificationChange(
                            "contractExpirations",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Invoice Reminders */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-gray-900">Invoice Reminders</p>
                      <p className="text-sm text-gray-500">
                        Alerts for overdue and upcoming invoices
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationPrefs.invoiceReminders}
                        onChange={(e) =>
                          handleNotificationChange(
                            "invoiceReminders",
                            e.target.checked,
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Role Permissions Section */}
          {activeSection === "permissions" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg" style={{ color: "#001f54" }}>
                    Role Permissions Overview
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Read-only view of permission settings by role
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <Lock className="w-4 h-4" style={{ color: "#4169e1" }} />
                  <span className="text-sm" style={{ color: "#4169e1" }}>
                    Read-only
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#f8f9fa" }}>
                    <tr>
                      <th className="text-left px-4 py-3 text-sm text-gray-600">
                        Role
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        View Projects
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        Edit Projects
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        View Users
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        Edit Users
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        View Financials
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        Edit Financials
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        View Reports
                      </th>
                      <th className="text-center px-4 py-3 text-sm text-gray-600">
                        System Settings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {rolePermissions.map((role) => (
                      <tr key={role.role} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{role.role}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.viewProjects ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.editProjects ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.viewUsers ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.editUsers ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.viewFinancials ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.editFinancials ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.viewReports ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          {role.permissions.systemSettings ? (
                            <CheckCircle className="w-5 h-5 mx-auto text-green-600" />
                          ) : (
                            <div className="w-5 h-5 mx-auto rounded-full bg-gray-200"></div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>Note:</strong> Permission modifications require
                      system administrator access and must be performed through
                      the user management interface. Contact your system
                      administrator to request permission changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button - Bottom of Page */}
          {activeSection !== "permissions" && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="px-6 py-3 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1" }}
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
