import { useEffect, useMemo, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import {
  getAdminTimesheets,
  approveTimesheet,
  rejectTimesheet,
} from "../../api/admin";
import { getCurrentUser } from "../../api/users";

interface TimesheetEntry {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  date: string | Date;
  hours: number;
  notes?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string | Date;
  reviewedAt?: string | Date | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function AdminTimesheetsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "PENDING" | "APPROVED" | "REJECTED"
  >("all");

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [user, data] = await Promise.all([
          getCurrentUser(),
          getAdminTimesheets(),
        ]);
        if (isMounted) {
          setUserData(user);
          setEntries(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshEntries = async () => {
    const data = await getAdminTimesheets();
    setEntries(data);
  };

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return "N/A";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const matchesSearch =
          entry.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || entry.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [entries, searchTerm, statusFilter],
  );

  const stats = {
    total: entries.length,
    pending: entries.filter((e) => e.status === "PENDING").length,
    approved: entries.filter((e) => e.status === "APPROVED").length,
    rejected: entries.filter((e) => e.status === "REJECTED").length,
    totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
  };

  const getStatusStyle = (status: TimesheetEntry["status"]) => {
    switch (status) {
      case "APPROVED":
        return { bg: "#f1f8e9", text: "#558b2f" };
      case "REJECTED":
        return { bg: "#ffebee", text: "#d32f2f" };
      case "PENDING":
      default:
        return { bg: "#fff3e0", text: "#ff9800" };
    }
  };

  const handleApprove = async (id: string) => {
    await approveTimesheet(id);
    await refreshEntries();
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason");
    if (!reason) return;
    await rejectTimesheet(id, reason);
    await refreshEntries();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage="admin"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <AdminSidebar activeItem="timesheets" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#e3f2fd" }}
              >
                <Clock className="w-7 h-7" style={{ color: "#4169e1" }} />
              </div>
              <div>
                <h1 className="text-4xl" style={{ color: "#001f54" }}>
                  Timesheets
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor staff time entries across all projects
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <FileText className="w-5 h-5" style={{ color: "#4169e1" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Total Entries
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#001f54" }}>
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fff3e0" }}
                >
                  <Clock className="w-5 h-5" style={{ color: "#ff9800" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Pending
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#ff9800" }}>
                    {stats.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <CheckCircle className="w-5 h-5" style={{ color: "#558b2f" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Approved
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#558b2f" }}>
                    {stats.approved}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#ffebee" }}
                >
                  <XCircle className="w-5 h-5" style={{ color: "#d32f2f" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Rejected
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#d32f2f" }}>
                    {stats.rejected}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <Calendar className="w-5 h-5" style={{ color: "#4169e1" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Total Hours
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#001f54" }}>
                    {stats.totalHours.toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by staff, project, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value as typeof statusFilter,
                    )
                  }
                  className="w-full pl-12 pr-10 py-3 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Staff
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No timesheet entries found
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <p
                                className="text-sm font-medium"
                                style={{ color: "#001f54" }}
                              >
                                {entry.staffName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {entry.staffEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {entry.projectName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {entry.clientName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className="text-sm font-medium"
                            style={{ color: "#4169e1" }}
                          >
                            {entry.hours.toFixed(1)}h
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: getStatusStyle(entry.status).bg,
                              color: getStatusStyle(entry.status).text,
                            }}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(entry.submittedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate">
                            {entry.notes || "-"}
                          </p>
                          {entry.rejectionReason && (
                            <p className="text-xs text-red-600 mt-1 truncate">
                              {entry.rejectionReason}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {entry.status === "PENDING" && (
                              <button
                                onClick={() => handleApprove(entry.id)}
                                className="p-2 rounded-lg hover:bg-green-50 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </button>
                            )}
                            {entry.status === "PENDING" && (
                              <button
                                onClick={() => handleReject(entry.id)}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
