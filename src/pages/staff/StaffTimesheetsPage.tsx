import { useState } from "react";
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

interface TimesheetEntry {
  id: number;
  projectId: number;
  projectName: string;
  date: string;
  hours: number;
  notes: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface Project {
  id: number;
  name: string;
  clientName: string;
}

export default function StaffTimesheetsPage() {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // Mock projects data
  const projects: Project[] = [
    { id: 1, name: "Website Redesign", clientName: "Acme Corporation" },
    { id: 2, name: "Mobile App Development", clientName: "TechStart Inc" },
    { id: 3, name: "E-commerce Platform", clientName: "Retail Solutions" },
    { id: 4, name: "Brand Identity Package", clientName: "Creative Studios" },
    {
      id: 5,
      name: "CRM System Integration",
      clientName: "Enterprise Solutions",
    },
    { id: 6, name: "Marketing Campaign Portal", clientName: "Marketing Pros" },
  ];

  // Mock timesheet entries
  const [timesheetEntries, setTimesheetEntries] = useState<TimesheetEntry[]>([
    {
      id: 1,
      projectId: 1,
      projectName: "Website Redesign",
      date: "2026-01-20",
      hours: 6.5,
      notes: "Worked on homepage design and responsive layout",
      status: "approved",
      submittedAt: "Jan 20, 2026 at 5:30 PM",
    },
    {
      id: 2,
      projectId: 2,
      projectName: "Mobile App Development",
      date: "2026-01-20",
      hours: 2.0,
      notes: "API integration planning meeting",
      status: "approved",
      submittedAt: "Jan 20, 2026 at 5:35 PM",
    },
    {
      id: 3,
      projectId: 1,
      projectName: "Website Redesign",
      date: "2026-01-21",
      hours: 8.0,
      notes: "Implemented navigation menu and footer components",
      status: "approved",
      submittedAt: "Jan 21, 2026 at 6:00 PM",
    },
    {
      id: 4,
      projectId: 3,
      projectName: "E-commerce Platform",
      date: "2026-01-22",
      hours: 5.5,
      notes: "Payment gateway configuration and testing",
      status: "pending",
      submittedAt: "Jan 22, 2026 at 4:45 PM",
    },
    {
      id: 5,
      projectId: 2,
      projectName: "Mobile App Development",
      date: "2026-01-22",
      hours: 3.0,
      notes: "Code review and bug fixes",
      status: "pending",
      submittedAt: "Jan 22, 2026 at 4:50 PM",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId || !hours || parseFloat(hours) <= 0) {
      alert("Please select a project and enter valid hours");
      return;
    }

    const selectedProject = projects.find((p) => p.id === selectedProjectId);
    if (!selectedProject) return;

    const newEntry: TimesheetEntry = {
      id: timesheetEntries.length + 1,
      projectId: selectedProjectId,
      projectName: selectedProject.name,
      date: selectedDate,
      hours: parseFloat(hours),
      notes: notes,
      status: "pending",
      submittedAt:
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " at " +
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
    };

    setTimesheetEntries([newEntry, ...timesheetEntries]);

    // Reset form
    setSelectedProjectId(null);
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setHours("");
    setNotes("");
  };

  const handleDelete = (entryId: number) => {
    setTimesheetEntries(
      timesheetEntries.filter((entry) => entry.id !== entryId),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#52c41a";
      case "rejected":
        return "#ff4d4f";
      case "pending":
        return "#faad14";
      default:
        return "#8c8c8c";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#f6ffed";
      case "rejected":
        return "#fff2f0";
      case "pending":
        return "#fffbe6";
      default:
        return "#fafafa";
    }
  };

  const filteredEntries = timesheetEntries.filter((entry) => {
    if (filterStatus === "all") return true;
    return entry.status === filterStatus;
  });

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
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
                      setSelectedProjectId(Number(e.target.value))
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
                    onClick={() => setFilterStatus("pending")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "pending"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "pending"
                        ? { backgroundColor: "#4169e1" }
                        : {}
                    }
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus("approved")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "approved"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "approved"
                        ? { backgroundColor: "#4169e1" }
                        : {}
                    }
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilterStatus("rejected")}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === "rejected"
                        ? "text-white shadow-sm"
                        : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                    }`}
                    style={
                      filterStatus === "rejected"
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
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {entry.submittedAt}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {entry.status === "pending" && (
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
                          {entry.status}
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
                      {entry.status === "pending" && (
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
