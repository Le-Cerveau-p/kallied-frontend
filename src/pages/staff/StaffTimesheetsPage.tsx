import { useEffect, useMemo, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  Clock,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  CheckCircle,
} from "lucide-react";
import {
  createStaffTimesheet,
  deleteStaffTimesheet,
  getMyStaffProjects,
  getStaffTimesheets,
} from "../../api/staff";
import { getCurrentUser } from "../../api/users";
import Toast from "../../components/Toast";

interface TimesheetEntry {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  hours: number;
  notes: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

interface Project {
  id: string;
  name: string;
  clientName: string;
}

export default function StaffTimesheetsPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PENDING" | "APPROVED" | "REJECTED"
  >("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [projectsData, entriesData, user] = await Promise.all([
          getMyStaffProjects(),
          getStaffTimesheets(),
          getCurrentUser(),
        ]);

        if (!isMounted) return;

        const mappedProjects: Project[] = projectsData.map((project: any) => ({
          id: project.id,
          name: project.name,
          clientName: project.clientName,
        }));

        const mappedEntries: TimesheetEntry[] = entriesData.map(
          (entry: any) => ({
            id: entry.id,
            projectId: entry.projectId,
            projectName: entry.projectName,
            date: new Date(entry.date).toISOString().split("T")[0],
            hours: entry.hours,
            notes: entry.notes ?? "",
            status: entry.status,
            submittedAt: new Date(entry.submittedAt).toLocaleString(),
          }),
        );

        setProjects(mappedProjects);
        setTimesheetEntries(mappedEntries);
        setUserName(user?.name ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId || !hours || parseFloat(hours) <= 0) {
      setToastMessage("Please select a project and enter valid hours.");
      return;
    }

    (async () => {
      try {
        const entry = await createStaffTimesheet({
          projectId: selectedProjectId,
          date: selectedDate,
          hours: parseFloat(hours),
          notes: notes || undefined,
        });

        const newEntry: TimesheetEntry = {
          id: entry.id,
          projectId: entry.projectId,
          projectName: entry.projectName,
          date: new Date(entry.date).toISOString().split("T")[0],
          hours: entry.hours,
          notes: entry.notes ?? "",
          status: entry.status,
          submittedAt: new Date(entry.submittedAt).toLocaleString(),
        };

        setTimesheetEntries([newEntry, ...timesheetEntries]);

        setSelectedProjectId(null);
        setSelectedDate(new Date().toISOString().split("T")[0]);
        setHours("");
        setNotes("");
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to submit timesheet entry. Please try again.");
      }
    })();
  };

  const handleDelete = (entryId: string) => {
    (async () => {
      try {
        await deleteStaffTimesheet(entryId);
        setTimesheetEntries(
          timesheetEntries.filter((entry) => entry.id !== entryId),
        );
      } catch (err) {
        console.error(err);
        setToastMessage("Failed to delete timesheet entry.");
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#52c41a";
      case "REJECTED":
        return "#ff4d4f";
      case "PENDING":
        return "#faad14";
      default:
        return "#8c8c8c";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "#f6ffed";
      case "REJECTED":
        return "#fff2f0";
      case "PENDING":
        return "#fffbe6";
      default:
        return "#fafafa";
    }
  };

  const filteredEntries = useMemo(() => {
    if (filterStatus === "all") return timesheetEntries;
    return timesheetEntries.filter((entry) => entry.status === filterStatus);
  }, [filterStatus, timesheetEntries]);

  // Calculate totals
  const totalHours = filteredEntries.reduce(
    (sum, entry) => sum + entry.hours,
    0,
  );
  const thisWeekEntries = timesheetEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return entryDate >= weekStart;
  });
  const thisWeekHours = thisWeekEntries.reduce(
    (sum, entry) => sum + entry.hours,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthNavbar currentPage="staff" userName={userName ?? undefined} />
        <StaffSidebar activeItem="timesheets" />
        <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl" style={{ color: "#001f54" }}>
                Loading timesheets...
              </h1>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toastMessage && (
        <Toast
          message={toastMessage}
          tone="error"
          onClose={() => setToastMessage(null)}
        />
      )}
      <AuthNavbar currentPage="staff" userName={userName ?? undefined} />
      <StaffSidebar activeItem="timesheets" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#e6f0ff" }}
              >
                <Clock className="w-6 h-6" style={{ color: "#4169e1" }} />
              </div>
              <h1 className="text-3xl" style={{ color: "#001f54" }}>
                Timesheets
              </h1>
            </div>
            <p className="text-gray-600">
              Log your hours and track time spent on projects
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {thisWeekHours.toFixed(1)}h
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#e6f0ff" }}
                >
                  <Calendar className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {filteredEntries.length}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#e6f0ff" }}
                >
                  <FileText className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Hours</p>
                  <p className="text-3xl" style={{ color: "#001f54" }}>
                    {totalHours.toFixed(1)}h
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#e6f0ff" }}
                >
                  <Clock className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Log Hours Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-5 h-5" style={{ color: "#4169e1" }} />
              <h2 className="text-xl" style={{ color: "#001f54" }}>
                Log Hours
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Selector */}
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#001f54" }}
                  >
                    Project *
                  </label>
                  <select
                    value={selectedProjectId || ""}
                    onChange={(e) =>
                      setSelectedProjectId(e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                    style={{
                      color: "#001f54",
                      focusRing: "#4169e1",
                    }}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.clientName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#001f54" }}
                  >
                    Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                    style={{ color: "#001f54" }}
                    required
                  />
                </div>

                {/* Hours Input */}
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: "#001f54" }}
                  >
                    Hours *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g., 8.0"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                    style={{ color: "#001f54" }}
                    required
                  />
                </div>
              </div>

              {/* Notes Field */}
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what you worked on..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{ color: "#001f54" }}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-white transition-all hover:shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: "#4169e1" }}
                >
                  <Save className="w-4 h-4" />
                  Submit Timesheet Entry
                </button>
              </div>
            </form>
          </div>

          {/* Logged Entries Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl" style={{ color: "#001f54" }}>
                  Logged Entries
                </h2>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "all"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "all"
                        ? { backgroundColor: "#4169e1" }
                        : {}
                    }
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("PENDING")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "PENDING"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "PENDING"
                        ? { backgroundColor: "#4169e1" }
                        : {}
                    }
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus("APPROVED")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "APPROVED"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "APPROVED"
                        ? { backgroundColor: "#4169e1" }
                        : {}
                    }
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilterStatus("REJECTED")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "REJECTED"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "REJECTED"
                        ? { backgroundColor: "#4169e1" }
                        : {}
                    }
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No timesheet entries found
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p
                            className="font-medium"
                            style={{ color: "#001f54" }}
                          >
                            {entry.projectName}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="font-medium"
                            style={{ color: "#4169e1" }}
                          >
                            {entry.hours.toFixed(1)}h
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-600 max-w-xs truncate">
                            {entry.notes || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                            style={{
                              backgroundColor: getStatusBgColor(entry.status),
                              color: getStatusColor(entry.status),
                            }}
                          >
                            {entry.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {entry.submittedAt}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {entry.status === "PENDING" && (
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete entry"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredEntries.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  No timesheet entries found
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p
                          className="font-medium mb-1"
                          style={{ color: "#001f54" }}
                        >
                          {entry.projectName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className="font-medium"
                          style={{ color: "#4169e1" }}
                        >
                          {entry.hours.toFixed(1)}h
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{
                            backgroundColor: getStatusBgColor(entry.status),
                            color: getStatusColor(entry.status),
                          }}
                        >
                            {entry.status.toLowerCase()}
                          </span>
                        </div>
                    </div>

                    {entry.notes && (
                      <p className="text-sm text-gray-600 mb-2">
                        {entry.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {entry.submittedAt}
                      </p>
                      {entry.status === "PENDING" && (
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
