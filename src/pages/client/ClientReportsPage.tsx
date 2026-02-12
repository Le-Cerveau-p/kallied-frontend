import { useEffect, useMemo, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import {
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  File,
  FileImage,
  FileCode,
  Calendar,
  FolderKanban,
  Filter,
  Search,
} from "lucide-react";
import { getClientReports } from "../../api/client";
import { getCurrentUser } from "../../api/users";

interface Report {
  id: string;
  name: string;
  category: string;
  version: string;
  uploadDate: string | Date;
  fileType:
    | "pdf"
    | "xlsx"
    | "docx"
    | "png"
    | "jpg"
    | "jpeg"
    | "zip"
    | "other";
  fileSize: string | null;
  projectName: string;
  canPreview: boolean;
  fileUrl: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function ClientReportsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [reports, user] = await Promise.all([
          getClientReports(),
          getCurrentUser(),
        ]);
        if (isMounted) {
          setAllReports(reports);
          setUserData(user);
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

  const allowedCategories = useMemo(
    () => ["Report", "Contract", "Analytics"],
    [],
  );

  const formatDate = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  // Get unique projects and categories
  const projects = useMemo(
    () => [
      "All Projects",
      ...Array.from(new Set(allReports.map((r) => r.projectName))),
    ],
    [allReports],
  );
  const categories = useMemo(
    () => [
      "All Categories",
      ...Array.from(
        new Set(
          allReports
            .map((r) => r.category)
            .filter((category) => allowedCategories.includes(category)),
        ),
      ),
    ],
    [allReports, allowedCategories],
  );

  // Filter reports
  const filteredReports = useMemo(
    () =>
      allReports.filter((report) => {
        const matchesSearch =
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProject =
          selectedProject === "All Projects" ||
          report.projectName === selectedProject;
        const matchesCategory =
          selectedCategory === "All Categories" ||
          report.category === selectedCategory;
        const matchesAllowedCategory = allowedCategories.includes(
          report.category,
        );
        return (
          matchesSearch &&
          matchesProject &&
          matchesCategory &&
          matchesAllowedCategory
        );
      }),
    [
      allReports,
      searchTerm,
      selectedProject,
      selectedCategory,
      allowedCategories,
    ],
  );

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
      case "docx":
        return <FileText className="w-5 h-5" />;
      case "xlsx":
        return <FileSpreadsheet className="w-5 h-5" />;
      case "png":
      case "jpg":
      case "jpeg":
        return <FileImage className="w-5 h-5" />;
      case "zip":
        return <FileCode className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getFileColor = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "#dc2626"; // red
      case "xlsx":
        return "#16a34a"; // green
      case "docx":
        return "#2563eb"; // blue
      case "png":
      case "jpg":
      case "jpeg":
        return "#9333ea"; // purple
      case "zip":
        return "#ea580c"; // orange
      default:
        return "#6b7280"; // gray
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage="client"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <ClientSidebar activeItem="reports" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
              Reports & Deliverables
            </h1>
            <p className="text-gray-600">
              Access and download your project reports and files
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Filter Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" style={{ color: "#4169e1" }} />
                  <h2 className="font-semibold" style={{ color: "#001f54" }}>
                    Filters
                  </h2>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={
                        {
                          borderColor: "#e5e7eb",
                          "--tw-ring-color": "#4169e1",
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>

                {/* Project Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="w-4 h-4" />
                      Project
                    </div>
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    style={
                      {
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4169e1",
                      } as React.CSSProperties
                    }
                  >
                    {projects.map((project) => (
                      <option key={project} value={project}>
                        {project}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Category
                    </div>
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                          selectedCategory === category
                            ? "text-white font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{
                          backgroundColor:
                            selectedCategory === category
                              ? "#4169e1"
                              : "transparent",
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedProject("All Projects");
                    setSelectedCategory("All Categories");
                  }}
                  className="w-full px-4 py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                  style={{ borderColor: "#4169e1", color: "#4169e1" }}
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Main Content - Reports Table */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold">
                    {filteredReports.length}
                  </span>{" "}
                  report
                  {filteredReports.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Reports Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {filteredReports.length === 0 ? (
                  // Empty State
                  <div className="p-12 text-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: "#4169e120" }}
                    >
                      <FileText
                        className="w-8 h-8"
                        style={{ color: "#4169e1" }}
                      />
                    </div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: "#001f54" }}
                    >
                      No reports found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your filters or search term to find what
                      you're looking for.
                    </p>
                  </div>
                ) : (
                  // Desktop Table View
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead
                          style={{
                            backgroundColor: "#f9fafb",
                            borderBottom: "1px solid #e5e7eb",
                          }}
                        >
                          <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Report Name
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Version
                            </th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Upload Date
                            </th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody
                          className="divide-y"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          {filteredReports.map((report) => (
                            <tr
                              key={report.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{
                                      backgroundColor: `${getFileColor(report.fileType)}20`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        color: getFileColor(report.fileType),
                                      }}
                                    >
                                      {getFileIcon(report.fileType)}
                                    </div>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900 truncate">
                                      {report.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {report.fileType.toUpperCase()} â€¢{" "}
                                      {report.fileSize ?? "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-sm text-gray-700">
                                  {report.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className="inline-block px-2 py-1 rounded-md text-xs font-medium"
                                  style={{
                                    backgroundColor: "#4169e120",
                                    color: "#4169e1",
                                  }}
                                >
                                  {report.version}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  {formatDate(report.uploadDate)}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  {report.canPreview && (
                                    <button
                                      onClick={() =>
                                        window.open(report.fileUrl, "_blank")
                                      }
                                      className="p-2 rounded-lg transition-all hover:bg-gray-100"
                                      title="Preview"
                                    >
                                      <Eye className="w-5 h-5 text-gray-600" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      window.open(report.fileUrl, "_blank")
                                    }
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                                    style={{
                                      backgroundColor: "#4169e1",
                                      color: "white",
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div
                      className="md:hidden divide-y"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      {filteredReports.map((report) => (
                        <div key={report.id} className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: `${getFileColor(report.fileType)}20`,
                              }}
                            >
                              <div
                                style={{ color: getFileColor(report.fileType) }}
                              >
                                {getFileIcon(report.fileType)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {report.name}
                              </h3>
                              <p className="text-xs text-gray-500 mb-2">
                                {report.fileType.toUpperCase()} â€¢{" "}
                                {report.fileSize ?? "N/A"}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-600">
                                  {report.category}
                                </span>
                                <span className="text-gray-300">â€¢</span>
                                <span
                                  className="px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: "#4169e120",
                                    color: "#4169e1",
                                  }}
                                >
                                  {report.version}
                                </span>
                                <span className="text-gray-300">â€¢</span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(report.uploadDate)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {report.canPreview && (
                              <button
                                onClick={() =>
                                  window.open(report.fileUrl, "_blank")
                                }
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all"
                                style={{
                                  borderColor: "#4169e1",
                                  color: "#4169e1",
                                }}
                              >
                                <Eye className="w-4 h-4" />
                                Preview
                              </button>
                            )}
                            <button
                              onClick={() =>
                                window.open(report.fileUrl, "_blank")
                              }
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                              style={{
                                backgroundColor: "#4169e1",
                                color: "white",
                              }}
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
